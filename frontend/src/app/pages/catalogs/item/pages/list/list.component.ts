import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { Subscription, Subject, of } from 'rxjs';
import { debounce, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ExportService } from 'src/app/pages/services/export.service';
import { IItem } from 'src/app/pages/interfaces/iitem';
import { ICategory } from 'src/app/pages/interfaces/icategory';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  user!: UserModel;
  module = 'item';
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  isLoading = false;
  searchTerm = '';
  selectedStatus = '';
  selectedParentCategory = '';
  pageNumber = 1;
  pageSize = 10;
  order: 'asc' | 'desc' = 'asc';
  orderBy = 'code';
  allData: IItem[] = [];
  allCategory: ICategory[] = [];
  allTotal = 0;

  searchResults: IItem[] = [];
  showDropdown = false;
  selectedIndex = -1;
  searchSubject = new Subject<{ term: string }>();
  searchCache: { [key: string]: { data: IItem[], timestamp: number } } = {};
  cacheExpirationTime = 30000;
  lastSearchTerm = '';
  searchHistory: { term: string; date: string }[] = [];
  preventReopen: boolean = false;
  favorites: { term: string; date: string }[] = [];
  searchMode: string;

  searchModes = [
    { value: 'code', label: 'Código' },
    { value: 'code_alternative', label: 'Código Alternativo' },
    { value: 'description', label: 'Descripción' },
  ];

  columnsPDF = [
    { header: 'Código', dataKey: 'code' },
    { header: 'Código Alterno', dataKey: 'code_alternative' },
    { header: 'Descripción', dataKey: 'description' },
    { header: 'Categoría', dataKey: 'categoryname' },
    { header: 'Creado', dataKey: 'created_at' },
    { header: 'Modificado', dataKey: 'modified_at' },
    { header: 'Status', dataKey: 'status' }
  ];

  pageTitle: string = '';

  private pageTitleSubscription!: Subscription;
  private routerSubscription!: Subscription;

  get totalRecords(): number { return this.allTotal; }
  get totalPages(): number { return Math.ceil(this.totalRecords / this.pageSize); }

  constructor(
    private authService: AuthService,
    private repository: RepositoryService,
    private cd: ChangeDetectorRef,
    private searchService: SearchService,
    private router: Router,
    private exportService: ExportService,
    private pageInfo: PageInfoService
  ) { }

  ngOnInit(): void {
    this.loadLS();
    this.subscribeToRouterEvents();
    this.subscribeToPageTitle();
    this.subscribeToSearch();
    this.pageNumber = 1;
    this.loadData();
    this.loadCategory();
  }

  loadLS() {
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_${this.module}_${this.searchMode}`) || '[]');
    this.favorites = JSON.parse(localStorage.getItem(`searchFavorites_${this.module}_${this.searchMode}`) || '[]');
    this.searchMode = localStorage.getItem(`searchMode_${this.module}`) || 'code';
  }

  setSearchMode() {
    localStorage.setItem('searchMode_' + this.module, this.searchMode);
    this.loadData();
  }

  subscribeToRouterEvents(): void { this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/administracion-de-partes')) { this.searchService.changeSearch(''); } }); }

  subscribeToPageTitle(): void {
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => this.user = user);
  }

  subscribeToSearch(): void {
    this.searchSubject.pipe(
      debounce(({ term }: { term: string }) => of(term.length > 5 ? 150 : 400)),
      distinctUntilChanged(),
      switchMap(({ term }) => {
        const trimmed = term.trim();
        if (!trimmed) return of([]);
        if (this.searchCache[trimmed]?.timestamp > Date.now() - this.cacheExpirationTime) { return of(this.searchCache[trimmed].data); }
        const payload = { [this.searchMode]: trimmed, limitqty: 10, ascending: 'ASC' };
        return this.repository.getPreByLike(this.module, payload).pipe(tap(results => results?.length && (this.searchCache[trimmed] = { data: results, timestamp: Date.now() })));
      })
    ).subscribe({
      next: results => { this.searchResults = results || []; this.showDropdown = this.searchResults.length > 0; this.cd.detectChanges(); },
      error: () => (this.searchResults = [], this.showDropdown = false)
    });

    setInterval(() => { const now = Date.now(); Object.keys(this.searchCache).forEach(key => now - this.searchCache[key].timestamp > this.cacheExpirationTime && delete this.searchCache[key]); }, this.cacheExpirationTime);
  }

  onSearch(): void {
    if (this.preventReopen) return;
    this.searchTerm = this.searchTerm.trim();
    if (!this.searchTerm) { this.clearSearch(); this.loadData(); return; }
    this.selectedIndex = -1;
    this.searchSubject.next({ term: this.searchTerm });
  }

  addRecentSearch(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;
    const key = `searchHistory_${this.module}_${this.searchMode}`;
    let storedHistory: { term: string; date: string }[] = JSON.parse(localStorage.getItem(key) || '[]');
    storedHistory = storedHistory.filter(item => item.term !== trimmedTerm);
    storedHistory.unshift({ term: trimmedTerm, date: new Date().toLocaleString() });
    if (storedHistory.length > 10) storedHistory.pop();
    localStorage.setItem(key, JSON.stringify(storedHistory));
    this.searchHistory = storedHistory;
    this.cd.detectChanges();
  }

  selectRecentSearch(term: string): void {
    this.searchTerm = term;
    this.toggleDropdown(true);
    this.addRecentSearch(this.searchTerm);
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_${this.module}_${this.searchMode}`) || '[]');
    this.loadData();
  }

  selectSuggestion(item: any): void {
    const MAX_LENGTH = 30;
    const suggestion = item?.[this.searchMode]?.trim();
    if (!suggestion) return;
    this.preventReopen = true;
    this.searchTerm = suggestion.length > MAX_LENGTH ? suggestion.substring(0, MAX_LENGTH) : suggestion;
    this.toggleDropdown(true);
    this.addRecentSearch(this.searchTerm);
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_${this.module}_${this.searchMode}`) || '[]');
    setTimeout(() => { this.loadData(); this.preventReopen = false; }, 500);
  }

  moveSelection(direction: number): void {
    const activeList = this.searchResults.length ? this.searchResults : this.searchHistory;
    if (!activeList.length) return;
    this.selectedIndex = (this.selectedIndex + direction + activeList.length) % activeList.length;
    this.cd.detectChanges();
    setTimeout(() => document.querySelector('.search-dropdown')
      ?.querySelectorAll('a')[this.selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
  }

  showSearchDropdown(): void {
    this.loadLS();
    if (this.preventReopen) return;
    if (this.showDropdown) return;
    this.showDropdown = true;
    this.selectedIndex = -1;
    this.cd.detectChanges();
  }

  updateFavorites(term: string, add: boolean): void {
    if (!(term = term.trim())) return;
    this.favorites = add
      ? [{ term, date: new Date().toLocaleString() }, ...this.favorites].slice(0, 10)
      : this.favorites.filter(item => item.term !== term);
    localStorage.setItem(`searchFavorites_${this.module}_${this.searchMode}`, JSON.stringify(this.favorites));
    this.preventReopen = true;
    setTimeout(() => { this.showDropdown = true; this.preventReopen = false; this.cd.detectChanges(); }, 150);
  }

  isFavorite = (term: string) => this.favorites.some(fav => fav.term === term);

  toggleDropdown = (forceClose = false) => { this.showDropdown = forceClose ? false : !!(this.searchResults.length || this.searchHistory.length); this.cd.detectChanges(); };

  hideDropdown = () => { if (!this.preventReopen) setTimeout(() => (this.showDropdown = false, this.cd.detectChanges()), 200); };

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
    this.cd.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void { if (!this.searchInput?.nativeElement.contains(event.target) && this.showDropdown) { this.showDropdown = false; this.cd.detectChanges(); } }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    if (event.key === 'Escape') { this.showDropdown = false; this.cd.detectChanges(); }
    if (event.ctrlKey && event.key.toLowerCase() === 'k') { event.preventDefault(); this.searchInput.nativeElement.focus(); this.showDropdown = true; this.cd.detectChanges(); }
    if (event.shiftKey && event.key === 'Enter') { event.preventDefault(); this.onSearch(); }
  }

  clearSearchHistory(): void {
    localStorage.removeItem(`searchHistory_${this.module}_${this.searchMode}`);
    this.searchHistory = [];
    this.clearSearch();
    this.loadData();
  }

  onEnter(): void {
    if (!this.searchTerm.trim() && this.selectedIndex === -1) return this.isLoading ? undefined : this.loadData();
    if (this.searchResults.length === 1) return this.selectSuggestion(this.searchResults[0]);
    if (this.selectedIndex !== -1 && this.searchResults.length) return this.selectSuggestion(this.searchResults[this.selectedIndex]);
    if (this.searchResults.length > 1) return this.loadData();

    const activeList = this.searchResults.length ? this.searchResults : this.searchHistory;
    if (activeList.length) {
      const selectedItem = activeList[this.selectedIndex !== -1 ? this.selectedIndex : 0];
      if (typeof selectedItem === 'object' && this.searchMode in selectedItem) {
        this.searchTerm = selectedItem[this.searchMode as keyof typeof selectedItem] as string;
        return this.selectSuggestion(selectedItem);
      }

      this.searchTerm = selectedItem.term;
      this.toggleDropdown(true);
      this.addRecentSearch(this.searchTerm);
      return this.loadData();
    }

    this.pageNumber = 1;
    this.loadData();
    this.toggleDropdown(true);
  }

  ngOnDestroy(): void { this.routerSubscription.unsubscribe(); this.pageTitleSubscription.unsubscribe(); }

  loadCategory(): void { this.repository.getAllData('category').subscribe((resp: ICategory[]) => { this.allCategory = resp; }); }

  loadData(): void {
    this.isLoading = true;
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      status: this.selectedStatus,
      categoryid: this.selectedParentCategory,
      searchMode: this.searchMode,
      fieldColumn: this.searchMode,
      fieldValue: this.searchTerm

    };
    this.repository.getAllDataPaginated(this.module, payload).subscribe(resp => {
      this.allData = resp.data;
      this.allTotal = resp.total;
      this.isLoading = false;
      this.searchInput.nativeElement.focus();
      this.clearSearch();
      this.cd.detectChanges();
    });
  }

  onPageSizeChange(): void { this.loadData(); }

  pageChanged(newPage: number): void { if (newPage >= 1 && newPage <= this.totalPages) { this.pageNumber = newPage; this.loadData(); } }

  getPageRange(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.pageNumber;
    const rangeSize = 5;
    const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
    const endPage = Math.min(totalPages, startPage + rangeSize - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  changeOrder(column: string): void { this.orderBy = column; this.order = this.order === 'asc' ? 'desc' : 'asc'; this.sortData(); }

  sortData(): void { this.allData.sort((a, b) => { const comparison = a[this.orderBy] < b[this.orderBy] ? -1 : (a[this.orderBy] > b[this.orderBy] ? 1 : 0); return this.order === 'asc' ? comparison : -comparison; }); }

  getArrow(column: string): string { return this.orderBy === column ? (this.order === 'asc' ? 'arrow-up' : 'arrow-down') : ''; }

  exportToPDF(printMode: boolean, orientation: 'p' | 'portrait' | 'l' | 'landscape') {
    const generateReport = (base64Image: string | null) =>
      this.exportService.generateInventoryReport(
        this.pageTitle, this.user.account,
        this.columnsPDF.map(col => col.header),
        this.allData.map(item => this.columnsPDF.map(col => item[col.dataKey] || '')),
        base64Image, orientation, printMode
      );

    this.user.account.image
      ? this.repository.getConvertImageToBase64({ path: this.user.account.image })
        .subscribe({ next: generateReport, error: () => generateReport(null) })
      : generateReport(null);
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getSearchLabel(): string { const mode = this.searchModes.find(m => m.value === this.searchMode); return mode ? mode.label : ''; }
}
