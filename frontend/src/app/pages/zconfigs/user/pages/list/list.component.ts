import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { Subscription } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  user!: UserModel;
  module: string = 'user';
  baseUrl: string = environment.baseUrl;
  basestatus = environment.modules.basestatus;

  isLoading = false;
  searchTerm = '';
  selectedStatus = 'activo';

  pageNumber = 1;
  pageSize = 10;

  order: 'asc' | 'desc' = 'asc';
  orderBy = 'fullname';

  allData: IUser[] = [];
  allDataFiltered: IUser[] = [];

  columnsPDF = [
    { header: 'Nombre', dataKey: 'fullname' },
    { header: 'Usuario', dataKey: 'username' },
    { header: 'Último Login', dataKey: 'lastlogin' },
    { header: 'Tipo', dataKey: 'type' },
    { header: 'Status', dataKey: 'status' }
  ];

  pageTitle: string = '';

  private pageTitleSubscription!: Subscription;
  private routerSubscription!: Subscription;

  get paginatedData() {
    const start = (this.pageNumber - 1) * this.pageSize;
    return this.allDataFiltered.slice(start, start + this.pageSize);
  }

  get totalRecords(): number {
    return this.allDataFiltered.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

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
    this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/configuracion-de-usuarios')) { this.searchService.changeSearch(''); } });
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
    this.repository.getAllData(this.module).subscribe((resp: IUser[]) => {
      this.allData = resp.map(({ password, ...rest }) => rest);
      this.filterData();
      this.isLoading = false;
      this.cd.detectChanges();
      this.searchInput.nativeElement.focus();
    });
  }

  getAllDataByStatus(newStatus: string = ''): void {
    this.selectedStatus = newStatus.trim().toLowerCase();
    this.filterData();
  }

  filterData(): void {
    let filteredData = this.allData;
    if (this.searchTerm) filteredData = filteredData.filter(item => item.fullname?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.selectedStatus) filteredData = filteredData.filter(item => item.status.trim().toLowerCase() === this.selectedStatus);
    this.allDataFiltered = filteredData;
    this.pageNumber = 1;
  }

  changeOrder(column: string): void {
    this.order = this.orderBy === column && this.order === 'asc' ? 'desc' : 'asc';
    this.orderBy = column;
    this.sortData();
  }

  sortData(): void {
    this.allDataFiltered.sort((a, b) => {
      const comparison = a[this.orderBy] < b[this.orderBy] ? -1 : (a[this.orderBy] > b[this.orderBy] ? 1 : 0);
      return this.order === 'asc' ? comparison : -comparison;
    });
  }

  getArrow(column: string): string { return this.orderBy === column ? (this.order === 'asc' ? 'arrow-up' : 'arrow-down') : ''; }

  pageChanged(newPage: number): void {
    this.pageNumber = newPage;
    this.cd.detectChanges();
    
  }

  exportToPDF(printMode: boolean, orientation: 'p' | 'portrait' | 'l' | 'landscape') {
    const generateReport = (base64Image: string | null) =>
      this.exportService.generateInventoryReport(
        this.pageTitle, this.user.account,
        this.columnsPDF.map(col => col.header),
        this.paginatedData.map(item => this.columnsPDF.map(col => item[col.dataKey] || '')),
        base64Image, orientation, printMode
      );

    this.user.account.image
      ? this.repository.getConvertImageToBase64({ path: this.user.account.image })
        .subscribe({ next: generateReport, error: () => generateReport(null) })
      : generateReport(null);
  }
}
