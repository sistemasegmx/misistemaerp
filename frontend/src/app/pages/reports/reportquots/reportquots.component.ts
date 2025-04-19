import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
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
  selector: 'app-reportquots',
  templateUrl: './reportquots.component.html'
})
export class ReportquotsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchInputEnte') searchInputEnte!: ElementRef;
  @ViewChild('searchInputFolio') searchInputFolio!: ElementRef;

  user!: UserModel;
  module = 'sale';
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;

  isLoading = false;
  searchTermEnte = '';
  searchTermFolio = '';
  selectedStatus = '';
  selectedCountry = '';
  isGroupedView = false;
  isToday: boolean = false;

  pageNumber = 1;
  pageSize = 10;

  order: 'asc' | 'desc' = 'desc';
  orderBy = 'folio';

  allData: ISale[] = [];
  allSellers: IUser[] = [];
  allCurrency: ICurrency[] = [];
  summaryData: any[] = [];
  allTotal = 0;

  columnsPDF = [
    { header: 'Folio', dataKey: 'folio' },
    { header: 'Cliente', dataKey: 'entename' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Total', dataKey: 'total' },
    { header: 'Moneda', dataKey: 'currency' },
    { header: 'Creador', dataKey: 'user_fullname' },
    { header: 'Fecha', dataKey: 'created_at' },
    { header: 'Modificado', dataKey: 'modified_at' }
  ];

  pageTitle: string = '';

  private pageTitleSubscription!: Subscription;
  private routerSubscription!: Subscription;

  get totalRecords(): number { return this.allTotal; }
  get totalPages(): number { return Math.ceil(this.totalRecords / this.pageSize); }

  selectedSeller = '';
  selectedCurrency = '';
  startDate = '';
  endDate = '';

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

    this.pageNumber = 1;
    this.loadResources();
  }

  ngAfterViewInit(): void { this.focusSearchInput(); }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.pageTitleSubscription.unsubscribe();
  }

  resetFilters() {
    this.searchTermEnte = '';
    this.searchTermFolio = '';
    this.pageNumber = 1;
    this.pageSize = 10;
    this.selectedSeller = '';
    this.selectedCurrency = '';
    this.startDate = '';
    this.endDate = '';
    this.allData = [];
    this.summaryData = [];

    this.allTotal = 0;
    this.cd.detectChanges();
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

  loadData(): void {
    this.isLoading = true;
    if (!this.startDate) { const currentDate = new Date(); this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]; }
    if (!this.endDate) { const currentDate = new Date(); this.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]; }

    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      status: this.selectedStatus,
      countrycode: this.selectedCountry,
      ascending: 'desc',
      type: 'cotizacion',
      folio: this.searchTermFolio,
      entename: this.searchTermEnte,
      created_by: this.selectedSeller,
      currency: this.selectedCurrency,
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.repository.getAllDataPaginatedReport(this.module, payload)
      .subscribe(resp => {
        this.allData = resp.data;
        this.groupSummaryData(resp.data);
        this.allTotal = resp.total;
        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  groupSummaryData(data: any) {
    const groupedData = data.reduce((acc: any, item: any) => {
      const key = `${item.entecode}-${item.status}-${item.currency}`;
      if (!acc[key]) {
        acc[key] = {
          entecode: item.entecode,
          entename: item.entename,
          status: item.status,
          currency: item.currency,
          total: 0,
          orderCount: 0
        };
      }
      acc[key].total += parseFloat(item.total);
      acc[key].orderCount += 1;
      return acc;
    }, {});

    this.summaryData = Object.values(groupedData);
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
            if (col.dataKey === 'user_fullname') return this.truncateText(value, 30);
            if (col.dataKey === 'entename') return this.truncateText(value, 30);
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

  toggleView(): void { this.isGroupedView = !this.isGroupedView; }
}
