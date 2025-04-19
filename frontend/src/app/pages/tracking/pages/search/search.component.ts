import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, debounce, distinctUntilChanged, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ISale } from 'src/app/pages/interfaces/isale';
import { PageInfoService } from 'src/app/_metronic/layout';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {

  user: UserModel;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  baseUrl = environment.baseUrl;
  todayDate: string;
  currentDateTime: string;
  currentFrase: any = {};
  frases: any[] = [];
  searchTerm = '';
  sendFolio: string = '';

  searchResults: ISale[] = [];
  showDropdown = false;
  selectedIndex = -1;
  searchSubject = new Subject<{ term: string }>();
  searchCache: { [key: string]: { data: ISale[], timestamp: number } } = {};
  cacheExpirationTime = 30000;
  lastSearchTerm = '';
  preventReopen: boolean = false;
  searchHistory: { term: string; id: string; folio: string; date: string }[] = [];
  favorites: { term: string; id: string; folio: string; date: string }[] = [];
  searchMode: string;

  searchModes = [
    { value: 'folio', label: 'Folio de Compra' },
    { value: 'trackingnumber', label: 'Número de Rastreo' },
    { value: 'entecode', label: 'Código de Proveedor' },
    { value: 'entename', label: 'Nombre del Proveedor' },
    { value: 'fiscalname', label: 'Razón Social' },
    { value: 'enteorder', label: 'Orden de Cliente' },
  ];

  private timerId: any;
  private fraseTimerId: any;
  private currentFraseIndex = 0;

  pageTitle: string = '';
  private pageTitleSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private pageInfo: PageInfoService,
    private repository: RepositoryService,
  ) {
    const date = new Date();
    this.todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    this.currentDateTime = this.getCurrentDateTime();
  }

  ngOnInit(): void {
    this.loadLS();
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.loadFrases();
      this.timerId = setInterval(() => { this.currentDateTime = this.getCurrentDateTime(); this.cdr.detectChanges(); }, 1000);
    });

    setTimeout(() => { this.cdr.detectChanges(); }, 100);
    this.subscribeToSearch();
  }

  loadLS() {
    this.searchMode = localStorage.getItem('searchModeTracking') || 'folio';
    this.favorites = JSON.parse(localStorage.getItem(`searchFavorites_tracking_${this.searchMode}`) || '[]');
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_tracking_${this.searchMode}`) || '[]');
  }

  ngAfterViewInit(): void { if (this.searchInput) { this.searchInput.nativeElement.focus(); } }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
    if (this.fraseTimerId) clearInterval(this.fraseTimerId);
    this.pageTitleSubscription.unsubscribe();
  }

  setSearchMode(): void {
    localStorage.setItem('searchModeTracking', this.searchMode);
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
    this.sendFolio = '';
    setTimeout(() => { this.searchInput.nativeElement.focus(); this.cdr.detectChanges(); }, 50);
  }

  onSubmit(): void {
    if (!this.sendFolio) return;
    this.router.navigate(['/rastreo-de-ordenes/', this.sendFolio]);
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private loadFrases(): void {
    this.http.get<any[]>('/assets/frases_celebres.json')
      .pipe(catchError(err => { return of([]); })).subscribe(data => {
        this.frases = data ?? [];
        if (this.frases.length > 0) {
          this.currentFrase = this.frases[0];
          if (this.fraseTimerId) clearInterval(this.fraseTimerId);
          this.fraseTimerId = setInterval(() => { this.updateFrase(); }, 5000);
        }
      });
  }

  private updateFrase(): void { if (this.frases.length > 0) { this.currentFraseIndex = (this.currentFraseIndex + 1) % this.frases.length; this.currentFrase = this.frases[this.currentFraseIndex]; this.cdr.detectChanges(); } }

  getOneById(saleId: string): void {
    this.repository.getOneById('sale', { id: saleId }).subscribe({
      next: (sale: ISale) => {
        this.sendFolio = sale.folio;
        this.onSubmit();
      },
      error: (error) => console.error('Error cargando venta:', error)
    });
  }

  subscribeToSearch(): void {
    this.searchSubject.pipe(
      debounce(({ term }: { term: string }) => of(term.length > 5 ? 150 : 400)),
      distinctUntilChanged(),
      switchMap(({ term }) => {
        const trimmed = term.trim();
        if (!trimmed) return of([]);
        if (this.searchCache[trimmed]?.timestamp > Date.now() - this.cacheExpirationTime) { return of(this.searchCache[trimmed].data); }
        const payload = { [this.searchMode]: trimmed, type: 'compra', limitqty: 10, ascending: 'ASC' };
        return this.repository.getPreByLike('sale', payload).pipe(tap(results => results?.length && (this.searchCache[trimmed] = { data: results, timestamp: Date.now() })));
      })
    ).subscribe({
      next: results => { this.searchResults = results || []; this.showDropdown = this.searchResults.length > 0; this.cdr.detectChanges(); },
      error: () => (this.searchResults = [], this.showDropdown = false)
    });

    setInterval(() => { const now = Date.now(); Object.keys(this.searchCache).forEach(key => now - this.searchCache[key].timestamp > this.cacheExpirationTime && delete this.searchCache[key]); }, this.cacheExpirationTime);
  }

  onSearch(): void {
    if (this.preventReopen) return;
    this.searchTerm = this.searchTerm.trim();
    if (!this.searchTerm) { this.clearSearch(); return; } this.selectedIndex = -1;
    this.searchSubject.next({ term: this.searchTerm });
  }

  addRecentSearch(payload: { term: string; id: string; folio: string; date: string }): void {
    if (!payload || !payload.id) return;
    const key = `searchHistory_tracking_${this.searchMode}`;
    let storedHistory: { term: string; id: string; folio: string; date: string }[] = JSON.parse(localStorage.getItem(key) || '[]');
    storedHistory = storedHistory.filter(item => item.id !== payload.id);
    storedHistory.unshift(payload);
    if (storedHistory.length > 10) storedHistory.pop();
    localStorage.setItem(key, JSON.stringify(storedHistory));
    this.searchHistory = storedHistory;
    this.cdr.detectChanges();
  }

  selectRecentSearch(item: { term: string; id: string; folio?: string; date: string }): void {
    if (!item?.id) return;
    this.toggleDropdown(true);
    this.cdr.detectChanges();
    item.folio ? (this.sendFolio = item.folio, this.onSubmit()) : this.getOneById(item.id);
  }

  selectSuggestion(item: any): void {
    if (!item?.id) return;
    this.addRecentSearch({ term: this.searchTerm, id: item.id, folio: item.folio, date: new Date().toLocaleString() });
    this.preventReopen = true;
    this.toggleDropdown(true);
    this.sendFolio = item.folio;
    setTimeout(() => { this.onSubmit(); this.preventReopen = false; }, 500);
  }

  moveSelection(direction: number): void {
    const activeList = this.searchResults.length ? this.searchResults : this.searchHistory;
    if (!activeList.length) return;
    this.selectedIndex = Math.max(0, Math.min(this.selectedIndex + direction, activeList.length - 1));
    this.cdr.detectChanges();
    setTimeout(() => {
      const dropdownItems = document.querySelectorAll('.search-dropdown tbody tr');
      if (dropdownItems[this.selectedIndex]) { dropdownItems[this.selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    }, 50);
  }

  private getActiveList(): any[] { return this.searchResults.length ? this.searchResults : this.favorites.length ? this.favorites : this.searchHistory; }

  showSearchDropdown(): void {
    this.loadLS();
    if (this.preventReopen) return;
    if (this.showDropdown) return;
    this.showDropdown = true;
    this.selectedIndex = -1;
    this.cdr.detectChanges();
  }

  updateFavorites(item: { term: string; id: string; folio: string; date: string }, add: boolean): void {
    if (!item?.id) return;
    const key = `searchFavorites_tracking_${this.searchMode}`;
    let storedFavorites: { term: string; id: string; folio: string; date: string }[] = JSON.parse(localStorage.getItem(key) || '[]');
    storedFavorites = add
      ? [{ ...item, date: new Date().toLocaleString() }, ...storedFavorites].slice(0, 10)
      : storedFavorites.filter(fav => fav.id !== item.id);
    localStorage.setItem(key, JSON.stringify(storedFavorites));
    this.favorites = storedFavorites;
    this.preventReopen = true;
    setTimeout(() => { this.showDropdown = true; this.preventReopen = false; this.cdr.detectChanges(); }, 150);
  }

  isFavorite = (term: string) => this.favorites.some(fav => fav.term === term);
  toggleDropdown = (forceClose = false) => { this.showDropdown = forceClose ? false : !!(this.searchResults.length || this.searchHistory.length); this.cdr.detectChanges(); };
  hideDropdown = () => { if (!this.preventReopen) setTimeout(() => (this.showDropdown = false, this.cdr.detectChanges()), 200); };

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void { if (!this.searchInput?.nativeElement.contains(event.target) && this.showDropdown) { this.showDropdown = false; this.cdr.detectChanges(); } }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    if (event.key === 'Escape') { this.showDropdown = false; this.cdr.detectChanges(); }
    if (event.ctrlKey && event.key.toLowerCase() === 'k') { event.preventDefault(); this.searchInput.nativeElement.focus(); this.showDropdown = true; this.cdr.detectChanges(); }
    if (event.shiftKey && event.key === 'Enter') { event.preventDefault(); this.onSearch(); }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    event.preventDefault();
    event.stopPropagation();

    const actions: Record<string, () => void> = {
      Escape: () => (this.showDropdown = false),
      ArrowDown: () => this.moveSelection(1),
      ArrowUp: () => this.moveSelection(-1),
      Enter: () => this.selectedIndex !== -1 && this.selectSuggestion(this.getActiveList()[this.selectedIndex]),
      k: () => event.ctrlKey && (this.searchInput.nativeElement.focus(), (this.showDropdown = true)),
    };

    actions[event.key]?.();
    this.cdr.detectChanges();
  }

  clearSearchHistory(): void {
    localStorage.removeItem(`searchHistory_tracking_${this.searchMode}`);
    this.searchHistory = [];
    this.clearSearch();
  }

  onEnter(): void {
    if (!this.searchTerm.trim() && this.selectedIndex === -1) return this.clearSearch();
    if (this.searchResults.length === 1) { return this.selectSuggestion(this.searchResults[0]); }
    if (this.selectedIndex !== -1 && this.searchResults.length) { return this.selectSuggestion(this.searchResults[this.selectedIndex]); }

    const activeList = this.searchResults.length ? this.searchResults : this.searchHistory;
    if (activeList.length) {
      const selectedItem = activeList[this.selectedIndex !== -1 ? this.selectedIndex : 0];
      if (typeof selectedItem === 'object' && this.searchMode in selectedItem) {
        this.searchTerm = selectedItem[this.searchMode as keyof typeof selectedItem] as string;
        return this.selectSuggestion(selectedItem);
      }
    }

    this.toggleDropdown(true);
  }

  getSearchLabel(): string { const mode = this.searchModes.find(m => m.value === this.searchMode); return mode ? mode.label : 'Folio de Compra'; }
  getStatusClass(status: string): string { return `badge-light-${status}`; }
  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }
}
