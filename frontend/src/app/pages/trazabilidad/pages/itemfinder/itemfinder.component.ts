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
import { IItem } from 'src/app/pages/interfaces/iitem';

@Component({
  selector: 'app-itemfinder',
  templateUrl: './itemfinder.component.html'
})
export class ItemfinderComponent implements OnInit, OnDestroy {

  user: UserModel;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  baseUrl = environment.baseUrl;
  todayDate: string;
  currentDateTime: string;
  currentFrase: any = {};
  frases: any[] = [];
  searchTerm = '';
  module = 'item';
  isLoading = false;
  heroe: IItem | null = null;

  searchResults: ISale[] = [];
  showDropdown = false;
  selectedIndex = -1;
  searchSubject = new Subject<{ term: string }>();
  searchCache: { [key: string]: { data: ISale[], timestamp: number } } = {};
  cacheExpirationTime = 30000;
  lastSearchTerm = '';
  preventReopen: boolean = false;
  searchHistory: { term: string; date: string }[] = [];
  favorites: { term: string; date: string }[] = [];
  searchMode: string;

  searchModes = [
    { value: 'code', label: 'Código' },
    { value: 'code_alternative', label: 'Código Alternativo' },
    { value: 'description', label: 'Descripción' },
  ];

  activeSection: string = 'resumen';

  tabs = [
    { section: 'resumen', label: 'Resumen' },
    { section: 'cotizaciones', label: 'Cotizaciones' },
    { section: 'compras', label: 'Compras' },
    { section: 'remisiones', label: 'Remisiones' },
    { section: 'bodegausa', label: 'Bodega USA' },
    { section: 'importacion', label: 'Proceso de Importación' },
    { section: 'bodegatijuana', label: 'Bodega Tijuana' }
  ];

  private timerId: any;
  private fraseTimerId: any;
  private currentFraseIndex = 0;

  pageTitle: string = '';
  private pageTitleSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
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
    this.searchMode = localStorage.getItem('searchModeTrazablidad') || 'code';
    this.favorites = JSON.parse(localStorage.getItem(`searchFavorites_trazabilidad_${this.searchMode}`) || '[]');
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_trazabilidad_${this.searchMode}`) || '[]');
  }

  ngAfterViewInit(): void { if (this.searchInput) { this.focusAndSelectSearchInput(); } }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
    if (this.fraseTimerId) clearInterval(this.fraseTimerId);
    this.pageTitleSubscription.unsubscribe();
  }

  setSearchMode() {
    localStorage.setItem('searchModeTrazablidad', this.searchMode);
    this.loadData();
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
      next: results => { this.searchResults = results || []; this.showDropdown = this.searchResults.length > 0; this.cdr.detectChanges(); },
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
    const key = `searchHistory_trazabilidad_${this.searchMode}`;
    let storedHistory: { term: string; date: string }[] = JSON.parse(localStorage.getItem(key) || '[]');
    storedHistory = storedHistory.filter(item => item.term !== trimmedTerm);
    storedHistory.unshift({ term: trimmedTerm, date: new Date().toLocaleString() });
    if (storedHistory.length > 10) storedHistory.pop();
    localStorage.setItem(key, JSON.stringify(storedHistory));
    this.searchHistory = storedHistory;
    this.cdr.detectChanges();
  }

  selectRecentSearch(term: string): void {
    this.searchTerm = term;
    this.toggleDropdown(true);
    this.addRecentSearch(this.searchTerm);
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_trazabilidad_${this.searchMode}`) || '[]');
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
    this.searchHistory = JSON.parse(localStorage.getItem(`searchHistory_trazabilidad_${this.searchMode}`) || '[]');
    setTimeout(() => { this.loadData(); this.preventReopen = false; }, 500);
  }

  moveSelection(direction: number): void {
    const activeList = this.searchResults.length ? this.searchResults : this.searchHistory;
    if (!activeList.length) return;
    this.selectedIndex = (this.selectedIndex + direction + activeList.length) % activeList.length;
    this.cdr.detectChanges();
    setTimeout(() => document.querySelector('.search-dropdown')
      ?.querySelectorAll('a')[this.selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
  }

  showSearchDropdown(): void {
    this.loadLS();
    if (this.preventReopen) return;
    if (this.showDropdown) return;
    this.showDropdown = true;
    this.selectedIndex = -1;
    this.cdr.detectChanges();
  }

  updateFavorites(term: string, add: boolean): void {
    if (!(term = term.trim())) return;
    this.favorites = add
      ? [{ term, date: new Date().toLocaleString() }, ...this.favorites].slice(0, 10)
      : this.favorites.filter(item => item.term !== term);
    localStorage.setItem(`searchFavorites_trazabilidad_${this.searchMode}`, JSON.stringify(this.favorites));
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
      k: () => event.ctrlKey && (this.focusAndSelectSearchInput(), (this.showDropdown = true)),
    };

    actions[event.key]?.();
    this.cdr.detectChanges();
  }

  clearSearchHistory(): void {
    localStorage.removeItem(`searchHistory_trazabilidad_${this.searchMode}`);
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

    this.loadData();
    this.toggleDropdown(true);
  }

  loadData(): void {
    if (!(this.searchTerm = this.searchTerm.trim())) return;
    this.isLoading = true;

    this.repository.getOneByColumn('item', this.searchMode, this.searchTerm).subscribe({
      next: (resp) => { this.heroe = resp ?? null; this.notifyChildrenToUpdate(); },
      error: (err) => (this.heroe = null),
      complete: () => { this.isLoading = false; this.cdr.detectChanges(); this.focusAndSelectSearchInput(); }
    });
  }

  notifyChildrenToUpdate(): void { const event = new CustomEvent('updateData'); window.dispatchEvent(event); }
  getSearchLabel(): string { const mode = this.searchModes.find(m => m.value === this.searchMode); return mode ? mode.label : 'Folio de Compra'; }
  getStatusClass(status: string): string { return `badge-light-${status}`; }
  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }
  private getActiveList(): any[] { return this.searchResults.length ? this.searchResults : this.favorites.length ? this.favorites : this.searchHistory; }
  private focusAndSelectSearchInput(): void { setTimeout(() => { if (this.searchInput?.nativeElement) { this.searchInput.nativeElement.focus(); this.searchInput.nativeElement.select(); } }, 100); }
  changeSection(section: string): void { this.activeSection = section; }
}
