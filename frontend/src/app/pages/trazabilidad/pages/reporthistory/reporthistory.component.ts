import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ICategory } from 'src/app/pages/interfaces/icategory';

@Component({
  selector: 'app-reporthistory',
  templateUrl: './reporthistory.component.html'
})
export class ReporthistoryComponent implements OnInit, OnDestroy {
  @Input() heroe: any;

  user!: UserModel;
  module = 'saleitems';
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;
  itemUnits = environment.modules.itemUnits;

  isLoading = false;
  searchTermItem = '';
  selectedStatus = '';
  selectedParentCategory = '';
  selectedUnitkey = '';

  pageNumber = 1;
  pageSize = 10;

  order: 'asc' | 'desc' = 'desc';
  orderBy = 'folio';

  allData: ISale[] = [];
  allSellers: IUser[] = [];
  allCategory: ICategory[] = [];
  summaryData: any[] = [];
  allTotal = 0;

  columnsPDF = [
    { header: 'No. Parte', dataKey: 'sicode' },
    { header: 'Descripción', dataKey: 'sidescription' },
    { header: 'Cantidad', dataKey: 'siqty' },
    { header: 'Unidad de Medida', dataKey: 'unitkey' },
    { header: 'Clientes', dataKey: 'saleentes' },
    { header: 'Orden', dataKey: 'saletype' },
    { header: 'Status', dataKey: 'salestatus' },
    { header: 'Rango', dataKey: 'salesfolios' },
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
  isGroupedView = false;

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
      allCategory: this.repository.getAllData('category') as Observable<ICategory[]>
    }).subscribe(({ allSellers, allCategory }) => {
      this.allSellers = allSellers.map(({ password, ...rest }: IUser) => rest);
      this.allCategory = allCategory;
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
      startDate: this.startDate,
      endDate: this.endDate,
      created_by: this.selectedSeller,
      status: this.selectedStatus,
      unitkey: this.selectedUnitkey,
      categoryid: this.selectedParentCategory,
      ascending: 'desc',
      fieldItemValue: this.searchTermItem
    };

    this.repository.getAllDataHistoryReport(this.module, payload)
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
      const key = `${item.sicode}-${item.saletype}`;

      if (!acc[key]) {
        acc[key] = {
          sicode: item.sicode,
          sidescription: item.sidescription,
          saletype: item.saletype,
          totalQuantity: 0,
          saleentes: 0,
          minFolio: parseInt(item.salefolios.split(' - ')[0]),
          maxFolio: parseInt(item.salefolios.split(' - ')[1]),
        };
      }

      acc[key].totalQuantity += parseInt(item.siqty);
      acc[key].saleentes += item.saleentes;
      acc[key].minFolio = Math.min(acc[key].minFolio, parseInt(item.salefolios.split(' - ')[0]));
      acc[key].maxFolio = Math.max(acc[key].maxFolio, parseInt(item.salefolios.split(' - ')[1]));

      return acc;
    }, {});

    this.summaryData = Object.values(groupedData);
  }



  onEnter(ele: string): void {
    this.pageNumber = 1;
    this.loadData();
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
            if (col.dataKey === 'sidescription') return this.truncateText(value, 30);
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

  toggleView(): void { this.isGroupedView = !this.isGroupedView; }
}
