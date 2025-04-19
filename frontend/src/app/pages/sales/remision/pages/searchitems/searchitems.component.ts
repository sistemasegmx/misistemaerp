import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { IItem } from 'src/app/pages/interfaces/iitem';
import { ICategory } from 'src/app/pages/interfaces/icategory';
import { ISale } from 'src/app/pages/interfaces/isale';
import { finalize } from 'rxjs/operators';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { IPricelevel } from 'src/app/pages/interfaces/ipricelevel';

@Component({
  selector: 'app-searchitems',
  templateUrl: './searchitems.component.html',
  styleUrls: ['./searchitems.component.css']
})
export class SearchItemsComponent implements OnInit {

  @Input() sale: ISale;
  @Input() pricelevel: IPricelevel;
  @Output() itemAdded = new EventEmitter<IItem>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  module = 'item';
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;

  isLoading = false;
  searchTerm = '';
  selectedParentCategory = '';

  pageNumber = 1;
  pageSize = 8;

  order: 'asc' | 'desc' = 'asc';
  orderBy = 'code';

  allTotal = 0;
  allData: IItem[] = [];
  allCategory: ICategory[] = [];
  actualCartItems: ISaleItems[] = [];


  get totalRecords(): number { return this.allTotal; }
  get totalPages(): number { return Math.ceil(this.totalRecords / this.pageSize); }

  constructor(
    private repository: RepositoryService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.pageNumber = 1;
    this.loadData();
    this.loadCategory();
  }

  loadCategory(): void {
    this.repository.getAllData('category').subscribe((resp: ICategory[]) => {
      this.allCategory = resp;
    });
  }

  loadData(): void {
    this.isLoading = true;
    const body = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      status: 'activo',
      categoryid: this.selectedParentCategory,
      fieldColumn: 'code',
      fieldValue: this.searchTerm
    };
    this.repository.getAllDataPaginated(this.module, body)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.searchInput.nativeElement.focus();
        this.cd.detectChanges();
      }))
      .subscribe(resp => {
        this.allData = resp.data;
        this.allTotal = resp.total;
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
  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';

  addToCart(item: IItem): void {
    item.isUpdating = true;
    this.cd.detectChanges();
    this.itemAdded.emit(item);
    item.isUpdating = false;
    this.cd.detectChanges();
  }

  calculatePrice(item: IItem): string {
    let basePrice = parseFloat(item.price);
    if (this.sale.currency !== item.currencyprice) { basePrice = basePrice * parseFloat(this.sale.parity); }
    const levelFactor = (parseFloat(this.pricelevel.amount) || 0) / 100;
    const modifiedPrice = basePrice * (1 + levelFactor);
    return modifiedPrice.toFixed(2);
  }
}
