import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
import { ISale } from 'src/app/pages/interfaces/isale';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  user!: UserModel;
  module = 'sale';
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;

  isLoading = false;
  searchTerm = '';
  selectedStatus = '';
  selectedCountry = '';

  pageNumber = 1;
  pageSize = 10;

  order: 'asc' | 'desc' = 'desc';
  orderBy = 'folio';

  allData: ISale[] = [];
  allTotal = 0;

  columnsPDF = [
    { header: 'Folio', dataKey: 'id' },
    { header: 'Tipo', dataKey: 'type' },
    { header: 'Items', dataKey: 'items' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Creado', dataKey: 'created_at' },
    { header: 'Modificado', dataKey: 'modified_at' }
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
    this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/recibos-bodega-usa')) { this.searchService.changeSearch(''); } });
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => this.user = user);

    this.pageNumber = 1;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.pageTitleSubscription.unsubscribe();
  }

  loadData(): void {
    this.isLoading = true;
    const body = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      status: this.selectedStatus,
      countrycode: this.selectedCountry,
      ascending: 'desc',
      type: 'bodega-usa',
      fieldColumn: 'folio',
      fieldValue: this.searchTerm
    };
    this.repository.getAllDataPaginated(this.module, body).subscribe(resp => {
      this.allData = resp.data;
      this.allTotal = resp.total;
      this.isLoading = false;
      this.searchInput.nativeElement.focus();
      this.cd.detectChanges();
    });
  }

  onEnter(): void { this.pageNumber = 1; this.loadData(); }

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
        this.allData.map(item => this.columnsPDF.map(col => item[col.dataKey] || '')),
        base64Image, orientation, printMode
      );

    this.user.account.image
      ? this.repository.getConvertImageToBase64({ path: this.user.account.image })
        .subscribe({ next: generateReport, error: () => generateReport(null) })
      : generateReport(null);
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getStatusClass(status: string): string { return `badge-light-${status}`; }
}
