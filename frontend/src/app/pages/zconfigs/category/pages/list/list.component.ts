import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
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
  module: string = 'category';
  baseUrl: string = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  isLoading = false;
  searchTerm = '';
  selectedStatus = 'activo';
  selectedParentCategory = '';
  pageNumber = 1;
  pageSize = 10;
  order: 'asc' | 'desc' = 'asc';
  orderBy = 'fullname';

  allData: any[] = [];
  allDataFiltered: any[] = [];
  allCategories: ICategory[] = [];

  columnsPDF = [
    { header: 'Nombre', dataKey: 'fullname' },
    { header: 'Descripción', dataKey: 'description' },
    { header: 'Padre', dataKey: 'categoryName' },
    { header: 'Status', dataKey: 'status' }
  ];

  pageTitle: string = '';

  private pageTitleSubscription!: Subscription;
  private routerSubscription!: Subscription;

  get paginatedData() { const start = (this.pageNumber - 1) * this.pageSize; return this.allDataFiltered.slice(start, start + this.pageSize); }
  get totalRecords(): number { return this.allDataFiltered.length; }
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
    this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/configuracion-de-categorias')) { this.searchService.changeSearch(''); } });
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => this.user = user);

    this.pageNumber = 1;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.pageTitleSubscription.unsubscribe();
  }

  private loadData(): void {
    this.isLoading = true;
    this.repository.getAllData(this.module).subscribe((resp: ICategory[]) => {
      this.allCategories = resp;
      this.combineData();
      this.isLoading = false;
      this.cd.detectChanges();
      this.searchInput.nativeElement.focus();
    });
  }

  private combineData(): void {
    this.allData = this.allCategories.flatMap(father =>
      this.allCategories
        .filter(child => child.categoryid === father.id)
        .map(child => ({ ...child, categoryName: father.fullname, parentCategoryId: father.id }))
    );
    this.filterData();
  }

  getAllDataByStatus(newStatus: string = ''): void {
    this.selectedStatus = newStatus.trim().toLowerCase();
    this.filterData();
  }

  filterData(): void {
    let filteredData = this.allData;
    if (this.searchTerm) filteredData = filteredData.filter(item => item.fullname?.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.selectedStatus) filteredData = filteredData.filter(item => item.status.trim().toLowerCase() === this.selectedStatus);
    if (this.selectedParentCategory) {
      const parentCategoryId = Number(this.selectedParentCategory);
      filteredData = filteredData.filter(item => item.parentCategoryId === parentCategoryId);
    }
    this.allDataFiltered = filteredData;
    this.pageNumber = 1;
  }

  changeOrder(column: string): void {
    if (this.orderBy === column) this.order = this.order === 'asc' ? 'desc' : 'asc';
    else { this.orderBy = column; this.order = 'asc'; }
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


  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';
}
