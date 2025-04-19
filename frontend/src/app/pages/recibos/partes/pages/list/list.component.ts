import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/modules/services/search.service';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { forkJoin, Observable, Subscription, switchMap } from 'rxjs';
import { ExportService } from 'src/app/pages/services/export.service';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { ISale } from 'src/app/pages/interfaces/isale';
import { AuthService, UserModel } from 'src/app/modules/auth';
import Swal from 'sweetalert2';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchInputItem') searchInputItem!: ElementRef;
  @ViewChild('searchInputEnte') searchInputEnte!: ElementRef;

  user!: UserModel;
  module = 'saleitems';
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;
  isLoading = false;
  searchTerm = '';
  searchTermItem = '';
  searchTermEnte = '';
  pageNumber = 1;
  pageSize = 10;
  order: 'asc' | 'desc' = 'desc';
  orderBy = 'folio';
  allData: ISaleItems[] = [];
  allSellers: IUser[] = [];
  allTotal = 0;
  cart: ISaleItems[] = [];
  currentStep: number = 1;
  saleType: string = '';
  selectedSeller = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';
  isToday: boolean = false;

  allowedStatuses: string[] = [
    "orden procesada",
    "material-in-transit",
    "recibo bodega usa",
    "proceso de importacion",
    "recibido bodega tijuana"
  ];

  visibleColumns: { usa: boolean; importacion: boolean; tijuana: boolean } = {
    usa: true,
    importacion: true,
    tijuana: true,
  };

  columnsPDF = [
    { header: 'No. Parte', dataKey: 'code' },
    { header: 'Descripción', dataKey: 'description' },
    { header: 'Cantidad Solicitada', dataKey: 'qty' },
    { header: 'Bodega USA', dataKey: 'delivered1' },
    { header: 'Proceso Importación', dataKey: 'delivered2' },
    { header: 'Bodega Tijuana', dataKey: 'delivered3' },
    { header: 'Folio', dataKey: 'folio' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Fecha', dataKey: 'salemodified_at' },
    { header: 'Proveedor', dataKey: 'entename' },
    { header: 'Vendedor', dataKey: 'fullname' }
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
    this.routerSubscription = this.router.events.subscribe(event => { if (event instanceof NavigationEnd && !event.urlAfterRedirects.startsWith('/movimiento-de-partes')) { this.searchService.changeSearch(''); } });
    this.pageTitleSubscription = this.pageInfo.title.subscribe(title => { this.pageTitle = title; });
    this.authService.currentUserSubject.subscribe(user => this.user = user);

    this.pageNumber = 1;
    this.loadResources();
    this.loadData();
    setTimeout(() => { this.searchInput.nativeElement.focus(); }, 0);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.pageTitleSubscription.unsubscribe();
  }

  loadResources() {
    forkJoin({
      allSellers: this.repository.getAllData('user') as Observable<IUser[]>,
    }).subscribe(({ allSellers }) => {
      this.allSellers = allSellers.map(({ password, ...rest }: IUser) => rest);
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

    if (!this.startDate) {
      const currentDate = new Date();
      this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    }
    if (!this.endDate) {
      const currentDate = new Date();
      this.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
    }

    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      ascending: 'desc',
      startDate: this.startDate,
      endDate: this.endDate,
      seller: this.selectedSeller,
      fieldValue: this.searchTerm,
      fieldItemValue: this.searchTermItem,
      fieldEnteValue: this.searchTermEnte,
      status: this.selectedStatus,
    };

    this.repository.getAllDataPaginatedBySaleItemsCompra(this.module, payload).subscribe((resp) => {
      this.allData = resp.data;
      this.allTotal = resp.total;
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }

  onEnter(): void {
    this.searchInput.nativeElement.focus();
    this.pageNumber = 1;
    this.loadData();
  }

  onEnterItem(): void {
    this.searchInputItem.nativeElement.focus();
    this.pageNumber = 1;
    this.loadData();
  }

  onEnterEnte(): void {
    this.searchInputEnte.nativeElement.focus();
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
    const filteredColumns = this.columnsPDF.filter(col => {
      if (col.dataKey === 'delivered1' && !this.visibleColumns.usa) return false;
      if (col.dataKey === 'delivered2' && !this.visibleColumns.importacion) return false;
      if (col.dataKey === 'delivered3' && !this.visibleColumns.tijuana) return false;
      return true;
    });

    const filteredData = this.allData.map(item => filteredColumns.map(col => item[col.dataKey] || ''));

    const generateReport = (base64Image: string | null) =>
      this.exportService.generateInventoryReport(
        this.pageTitle,
        this.user.account,
        filteredColumns.map(col => col.header),
        filteredData,
        base64Image,
        orientation,
        printMode
      );

    this.user.account.image
      ? this.repository.getConvertImageToBase64({ path: this.user.account.image })
        .subscribe({
          next: generateReport,
          error: () => generateReport(null)
        })
      : generateReport(null);
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  toggleItemSelection(item: ISaleItems): void {
    const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
    index === -1 ? this.cart.push({ ...item, receivedQuantity: item.receivedQuantity || 1 }) : this.cart.splice(index, 1);
  }

  validateReceivedQuantity(item: ISaleItems): void {
    item.receivedQuantity = Math.max(1, parseFloat((+item.receivedQuantity || 1).toFixed(2)));
  }

  isCartValid(): boolean {
    return this.cart.length > 0 && this.cart.every(item => item.receivedQuantity >= 1);
  }

  isItemSelected(item: ISaleItems): boolean { return this.cart.some(cartItem => cartItem.id === item.id); }

  nextStep(): void { if (this.currentStep < 3) { this.currentStep++; } }
  previousStep(): void { if (this.currentStep > 1) { this.currentStep--; } }
  selectSaleType(type: string): void { this.saleType = type; this.nextStep(); }

  submitCart(): void {
    if (this.cart.some(item => item.receivedQuantity <= 0)) { Swal.fire('Cantidad a Recibir', 'Por favor, ingrese una cantidad válida para todos los ítems.', 'error'); return; }

    const currentDate = new Date();
    const salePayload = {
      accountid: this.user.accountid,
      type: this.saleType,
      items: this.cart.length.toString(),
      startdate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
      status: 'activo',
      validity: '0',
    };

    this.repository.postItem('sale', salePayload).subscribe({
      next: (resp: ISale) => { if (resp.id) this.submitCartItems(resp.id); },
      error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error')
    });
  }

  submitCartItems(reciboId: string): void {
    if (this.cart.length === 0) { Swal.fire('Carrito', 'El carrito está vacío', 'error'); return; }
    if (this.cart.some(item => item.receivedQuantity <= 0)) { Swal.fire('Error', 'Por favor, asegúrese de que todos los ítems tengan cantidades válidas', 'error'); return; }

    const payload = {
      bulk: this.cart.map(item => ({
        controlid: item.id,
        saleid: reciboId,
        itemid: item.itemid,
        code: item.code,
        description: item.description,
        unitkey: item.unitkey,
        qty: item.qty,
        receivedQuantity: item.receivedQuantity,
        delivered1: item.delivered1,
        delivered2: item.delivered2,
        delivered3: item.delivered3,
        estimated: item.comments?.toUpperCase() || '',
        saletype: this.saleType,
        originsale: 'compra',
        originfolio: item.folio,
        price: item.price,
        cost: item.cost,
        created_by: this.user.id,
      })),
    };

    this.repository.postItem('saleitemsbulk', payload)
      .subscribe({
        next: () => {
          const uniqueSaleIds = Array.from(new Set(this.cart.map(item => item.saleid)));
          uniqueSaleIds.forEach(posaleid => this.changeStatusSale(posaleid, reciboId));
          this.cart = [];
        },
        error: (err) => { console.error('Error al guardar los ítems:', err); },
      });
  }

  changeStatusSale(posaleid: string, reciboId: string): void {
    const statusMap: Record<string, string> = {
      'bodega-usa': 'recibo bodega usa',
      'proceso-importacion': 'proceso de importacion',
      'bodega-tijuana': 'recibido bodega tijuana',
    };

    const status: string = statusMap[this.saleType];
    if (!status) { Swal.fire('Error', 'Tipo de proceso inválido o no configurado.', 'error'); return; }

    const payload = { id: posaleid, status: status };

    this.repository.putItem('sale', payload)
      .pipe(
        switchMap(() => {
          const currentStatus = this.salestatus.find(s => s.status === status);
          const saleHistoryPayload = {
            saleid: posaleid,
            status: status,
            description: currentStatus ? currentStatus.description : '',
            module: 'recibos',
            action: 'status'
          };
          return this.repository.postItem('salehistory', saleHistoryPayload);
        })
      )
      .subscribe({
        next: () => {
          const saleTypeName = this.getSaleTypeName();
          Swal.fire('Éxito', `Recibo ${saleTypeName} generado correctamente`, 'success');
          this.router.navigate([`/recibos-${this.saleType}/${reciboId}`]);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el Registro o el historial', 'error')
      });
  }

  getSaleTypeName(): string {
    return this.saleType === 'bodega-usa'
      ? 'Bodega USA'
      : this.saleType === 'proceso-importacion'
        ? 'Proceso de Importación'
        : 'Bodega Tijuana';
  }

  getStatusClass(status: string): string { return `badge-light-${status}`; }

  setToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;
    this.loadData();
  }

  updateVisibleColumns(): void {
    this.visibleColumns = {
      usa: this.selectedStatus === '' || this.selectedStatus === 'recibo bodega usa',
      importacion: this.selectedStatus === '' || this.selectedStatus === 'proceso de importacion',
      tijuana: this.selectedStatus === '' || this.selectedStatus === 'recibido bodega tijuana',
    };
  }

}
