import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { ICurrency } from 'src/app/pages/interfaces/icurrency';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-bodegausa',
  templateUrl: './bodegausa.component.html'
})
export class BodegausaComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() heroe: any;

  @ViewChild('searchInputEnte') searchInputEnte!: ElementRef;
  @ViewChild('searchInputFolio') searchInputFolio!: ElementRef;

  user!: UserModel;
  module = 'saleitems';
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;

  isLoading = false;
  searchTermItem = '';
  searchTermEnte = '';
  searchTermFolio = '';
  selectedStatus = '';
  selectedCountry = '';
  selectedCurrency = '';

  pageNumber = 1;
  pageSize = 10;

  order: 'asc' | 'desc' = 'desc';
  orderBy = 'folio';

  allData: ISale[] = [];
  allSellers: IUser[] = [];
  allCurrency: ICurrency[] = [];
  allTotal = 0;

  columnsPDF = [
    { header: 'No. Parte', dataKey: 'code' },
    { header: 'Descripción', dataKey: 'description' },
    { header: 'Cant', dataKey: 'qty' },
    { header: '$', dataKey: 'price' },
    { header: '$', dataKey: 'salecurrency' },
    { header: 'Atendido', dataKey: 'fullname' },
    { header: 'Fecha', dataKey: 'modified_at' },
    { header: 'Folio', dataKey: 'folio' },
    { header: 'Proveedor', dataKey: 'saleentename' },
    { header: 'Creada', dataKey: 'salecreated_at' },
    { header: 'Status', dataKey: 'salestatus' }
  ];

  pageTitle: string = '';

  private pageTitleSubscription!: Subscription;
  private routerSubscription!: Subscription;

  get totalRecords(): number { return this.allTotal; }
  get totalPages(): number { return Math.ceil(this.totalRecords / this.pageSize); }

  selectedSeller = '';
  startDate = '';
  endDate = '';

  isToday: boolean = false;

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
    this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/reporte')) { this.searchService.changeSearch(''); } });
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => this.user = user);

    this.searchTermItem = this.heroe?.code || '';

    this.pageNumber = 1;
    this.loadResources();
    window.addEventListener('updateData', this.handleUpdateData.bind(this));
  }

  ngAfterViewInit(): void { this.focusSearchInput(); }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.pageTitleSubscription.unsubscribe();
    window.removeEventListener('updateData', this.handleUpdateData.bind(this));
  }

  handleUpdateData(): void { setTimeout(() => { this.searchTermItem = this.heroe?.code || ''; this.loadData(); }, 50); }

  toggleDateRange(): void {
    if (this.isToday) {
      const currentDate = new Date();
      this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
      this.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.startDate = today;
      this.endDate = today;
    }

    this.isToday = !this.isToday;
    this.loadData();
  }

  loadResources() {
    forkJoin({
      allSellers: this.repository.getAllData('user') as Observable<IUser[]>,
      allCurrency: this.repository.getAllData('currency') as Observable<ICurrency[]>
    }).subscribe(({ allSellers, allCurrency }) => {
      this.allSellers = allSellers.map(({ password, ...rest }: IUser) => rest);
      this.allCurrency = allCurrency;
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading = true;
    if (!this.startDate) { const currentDate = new Date(); this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]; }
    if (!this.endDate) { const currentDate = new Date(); this.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]; }

    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      countrycode: this.selectedCountry,
      currency: this.selectedCurrency,
      startDate: this.startDate,
      endDate: this.endDate,
      entename: this.searchTermEnte,
      folio: this.searchTermFolio,
      created_by: this.selectedSeller,
      status: this.selectedStatus,
      ascending: 'desc',
      type: 'bodega-usa',
      fieldItemValue: this.searchTermItem
    };

    this.repository.getAllDataPaginatedReport(this.module, payload)
      .subscribe(resp => {
        this.allData = resp.data;
        this.allTotal = resp.total;
        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  onEnter(ele: string): void {
    this.pageNumber = 1;
    this.loadData();

    const inputMap: { [key: string]: ElementRef } = {
      ente: this.searchInputEnte,
      folio: this.searchInputFolio
    };

    if (inputMap[ele]) {
      setTimeout(() => {
        inputMap[ele].nativeElement.focus();
        inputMap[ele].nativeElement.select();
      }, 10);
    }
  }

  onPageSizeChange(): void { this.loadData(); }

  pageChanged(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageNumber = newPage;
      this.loadData();
    }
  }

  getPageRange(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.pageNumber;
    const rangeSize = 5;
    const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
    const endPage = Math.min(totalPages, startPage + rangeSize - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  changeOrder(column: string): void {
    this.orderBy = column;
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.sortData();
  }

  sortData(): void {
    this.allData.sort((a, b) => {
      const comparison = a[this.orderBy] < b[this.orderBy] ? -1 : (a[this.orderBy] > b[this.orderBy] ? 1 : 0);
      return this.order === 'asc' ? comparison : -comparison;
    });
  }

  getArrow(column: string): string { return this.orderBy === column ? (this.order === 'asc' ? 'arrow-up' : 'arrow-down') : ''; }

  exportToPDF(printMode: boolean, orientation: 'p' | 'portrait' | 'l' | 'landscape') {
    const generateReport = (base64Image: string | null) =>
      this.exportService.generateInventoryReport(
        this.pageTitle, this.user.account,
        this.columnsPDF.map(col => col.header),
        this.allData.map(item =>
          this.columnsPDF.map(col => {
            let value = item[col.dataKey] || '';
            if (col.dataKey === 'description') return this.truncateText(value, 15);
            if (col.dataKey === 'saleentename') return this.truncateText(value, 15);
            if (col.dataKey === 'fullname') return this.truncateText(value, 15);
            return value;
          })
        ),

        base64Image, orientation, printMode
      );

    this.user.account.image
      ? this.repository.getConvertImageToBase64({ path: this.user.account.image })
        .subscribe({ next: generateReport, error: () => generateReport(null) })
      : generateReport(null);
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getStatusClass(status: string): string { return `badge-light-${status}`; }

  focusSearchInput(): void { if (this.searchInputEnte && this.searchInputEnte.nativeElement) { this.searchInputEnte.nativeElement.focus(); } }
}
