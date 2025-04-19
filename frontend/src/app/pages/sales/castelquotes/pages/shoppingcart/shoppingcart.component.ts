import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IItem } from 'src/app/pages/interfaces/iitem';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { ChangeDetectorRef } from '@angular/core';
import { ISale } from 'src/app/pages/interfaces/isale';
import { finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { firstValueFrom, Observable } from 'rxjs';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { InfoComponent } from '../info/info.component';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/pages/services/export.service';
import { environment } from 'src/environments/environment';
import { IPricelevel } from 'src/app/pages/interfaces/ipricelevel';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html'
})
export class ShoppingCartComponent implements OnInit, AfterViewInit {

  @Input() sale: ISale;
  @Input() ente: IEnte;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(InfoComponent) infoComponent: InfoComponent;

  user: UserModel;
  staff: IUser;
  pricelevel: IPricelevel = { id: '', fullname: '', description: '', amount: '', status: '' };
  activeSection: string = 'cart';
  isLoading: boolean = true;
  module: string = 'saleitems';
  cartItems: ISaleItems[] = [];
  totalAmount: number = 0;
  searchResults: IItem[] = [];
  selectedItem: IItem | null = null;
  searchQuery: string = '';
  emailButtonDisabled = true;

  lastModifiedItem: ISaleItems | null = null;
  itemUnits = environment.modules.itemUnits;

  calculatedValues = {
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    due: 0
  };

  constructor(
    private authService: AuthService,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.setFocusOnSearchInput();
    if (this.sale.created_by) this.loadStaffData(this.sale.created_by);
    this.loadPricelevelData(this.sale.pricelevel);
    this.authService.currentUserSubject.subscribe(user => { this.user = user; });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (!this.user.account.image) return;

    this.repositoryService.getConvertImageToBase64({ path: this.user.account.image }).subscribe({
      next: (base64Image: string) => {
        const logoImg = document.querySelector('img#logo') as HTMLImageElement;
        if (logoImg) logoImg.src = base64Image;
        this.cdr.detectChanges();
        this.emailButtonDisabled = false;
      },
      error: (error: any) => console.error('Error al convertir la imagen a Base64:', error)
    });

    setTimeout(() => this.cdr.detectChanges(), 100);
  }

  private loadStaffData(id: string | null): void {
    this.repositoryService.getOneById('user', { id })
      .subscribe({
        next: (resp: IUser) => { this.staff = resp; this.cdr.detectChanges(); },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  private loadPricelevelData(id: string): void {
    this.repositoryService.getOneById('pricelevel', { id })
      .subscribe({
        next: (resp: IPricelevel) => { this.pricelevel = resp; this.cdr.detectChanges(); },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  loadCart(): void {
    this.isLoading = true;
    this.repositoryService.getListByColumn(this.module, 'saleid', this.sale.id)
      .pipe(finalize(() => { this.isLoading = false; this.setFocusOnSearchInput() }))
      .subscribe({
        next: (items) => {
          this.cartItems = items;
          this.calculateTotal();
          this.cdr.detectChanges();
        },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  setFocusOnSearchInput(): void {
    this.isLoading = false;
    this.cdr.detectChanges();
    setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  searchItem(query: string): void {
    if (!(query = query.trim())) { this.activeSection = 'cart'; return; }
    this.isLoading = true;
    this.searchInput.nativeElement.value = '';
    const [code, qty] = query.split('*').map(p => p.trim());
    this.repositoryService.getOneByColumn('item', 'code', code).subscribe({
      next: res => res?.id && this.addItemToCart(res, qty && !isNaN(+qty) ? +qty : 1),
      complete: () => { this.isLoading = false; this.setFocusOnSearchInput(); }
    });
  }

  addItemToCart(item: IItem, quantity: number = 1): void {

    const pricelevelAmount = parseFloat(this.pricelevel.amount) || 0;
    const finalValue = pricelevelAmount === 0
      ? this.convertCurrency(+item.price, item.currencyprice)
      : +(this.convertCurrency(+item.cost, item.currencycost) * (1 + pricelevelAmount / 100)).toFixed(2);
    const refreshCart = () => { this.updateSale(); this.loadCart(); this.cdr.detectChanges(); };
    const existingItem = this.cartItems.find(cartItem => cartItem.itemid === item.id);

    if (existingItem) {
      existingItem.qty += quantity;
      existingItem.price = finalValue;
      existingItem.cost = finalValue;
      this.lastModifiedItem = existingItem;

      this.updateItem(existingItem).subscribe({ next: refreshCart, error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error') });

    } else {
      const newItem: ISaleItems = {
        id: '',
        saleid: this.sale.id,
        itemid: item.id,
        code: item.code,
        description: item.description,
        unitkey: item.unitkey,
        qty: quantity,
        price: finalValue,
        priceold: finalValue,
        cost: finalValue,
        estimated: '',
        created_by: '',
        created_at: '',
        modified_by: '',
        modified_at: '',
        item: item,
        quantity: quantity,
        isUpdating: false
      };

      this.cartItems.push(newItem);
      this.lastModifiedItem = newItem;

      this.createItem(newItem).subscribe({ next: refreshCart, error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error') });
    }

    this.calculateTotal();
    this.cdr.detectChanges();
  }


  private createItem(item: ISaleItems): Observable<ISaleItems> {
    this.isLoading = true;
    return this.repositoryService.postItem(this.module, item)
      .pipe(
        tap({ next: (resp: ISaleItems) => { item.id = resp.id; }, error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error') }),
        finalize(() => this.isLoading = false)
      );
  }

  private updateItem(item: ISaleItems): Observable<any> {
    this.isLoading = true;
    return this.repositoryService.putItem(this.module, item)
      .pipe(
        tap({ next: (resp) => { }, error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error') }),
        finalize(() => this.isLoading = false)
      );
  }

  updateCartItem(item: ISaleItems): void {
    this.isLoading = true;
    this.lastModifiedItem = item;

    const payload = {
      id: item.id,
      qty: item.qty,
      price: item.price,
      priceold: item.price,
      cost: item.cost,
      estimated: item.estimated?.toUpperCase() || '',
      unitkey: item.unitkey
    };

    this.repositoryService.putItem(this.module, payload)
      .pipe(finalize(() => {
        this.isLoading = false;
        item.isUpdating = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => { this.calculateTotal(); this.updateSale(); this.cdr.detectChanges(); },
        error: (error) => { item.isUpdating = false; this.cdr.detectChanges(); }
      });
  }

  calculateTotal(): void {
    const taxRate = parseFloat(this.sale.taxamount);
    const subtotal = this.cartItems.reduce((sum, item) => { const price = item.price; const quantity = item.qty; return sum + (price * quantity); }, 0);
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    const paidAmount = parseFloat(this.sale.paid.toString());
    this.calculatedValues = {
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: totalAmount,
      due: totalAmount - paidAmount
    };
  }

  private updateSale(): void {
    const payload = {
      id: this.sale.id,
      subtotal: this.calculatedValues.subtotal,
      taxAmount: this.calculatedValues.taxAmount,
      total: this.calculatedValues.total,
      items: this.cartItems.length,
      status: 'atendiendo'
    };
    this.repositoryService.putItem('sale', payload)
      .pipe(finalize(() => { this.sale.status = payload.status; this.isLoading = false }))
      .subscribe({ next: (resp) => { }, error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error') });
  }

  removeFromCart(id: string): void {
    const itemToRemove = this.cartItems.find(cartItem => cartItem.id === id);
    if (!itemToRemove) { Swal.fire('Error', 'El ítem no se encuentra en el carrito. Inténtelo de nuevo.', 'error'); return; }
    const index = this.cartItems.indexOf(itemToRemove);
    this.cartItems.splice(index, 1);
    this.calculateTotal();
    this.updateSale();
    this.cdr.detectChanges();
    this.repositoryService.deleteItem(this.module, id)
      .subscribe({
        next: () => { },
        error: (error) => {
          this.cartItems.splice(index, 0, itemToRemove);
          this.calculateTotal();
          this.updateSale();
          this.cdr.detectChanges();
          Swal.fire('Error', 'No se pudo eliminar el ítem. Inténtelo de nuevo.', 'error');
        }
      });
  }

  onEstimatedChange(item: ISaleItems): void {
    if (item.estimated.length > 128) { item.estimated = item.estimated.substring(0, 128); }
    this.updateCartItem(item);
  }

  incrementQuantity(item: ISaleItems): void {
    item.isUpdating = true;
    item.qty += 1;
    this.updateCartItem(item);
  }

  decrementQuantity(item: ISaleItems): void {
    item.isUpdating = true;
    if (item.qty > 1) {
      item.qty -= 1; this.updateCartItem(item);
    } else if (item.qty === 1) { this.removeFromCart(item.id); }
  }

  getTotalPrice(price: number, quantity: number): number { return price * quantity; }
  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';

  handleItemAdded(item: IItem): void { this.addItemToCart(item); }

  convertCurrency(itemPrice: number, itemCurrency: string): number { return itemPrice * (this.sale.currency !== itemCurrency ? parseFloat(this.sale.parity) : 1); }

  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'cart') { this.setFocusOnSearchInput(); }
    else if (section === 'info') { this.cdr.detectChanges(); }
  }

  closeSale(): void {
    this.repositoryService.putItem('sale', { id: this.sale.id, status: 'finalizada' }).subscribe({
      next: (resp) => resp === 200 && (this.activeSection = 'info', this.cdr.detectChanges(), setTimeout(() => this.printInfo(), 300)),
      error: () => Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
    });
  }

  sendEmail = async (): Promise<void> => {
    this.activeSection = 'info';
    this.emailButtonDisabled = true;
    this.cdr.detectChanges();
    const pdfBlob = await this.exportService.generatePDFBlobCart('#my-table');
    if (pdfBlob) { this.confirmSendEmail(pdfBlob); }
    else { Swal.fire('Error', 'No se pudo generar el PDF', 'error').then(() => { this.emailButtonDisabled = false; this.cdr.detectChanges(); }); }
  };

  confirmSendEmail(pdfBlob: Blob): void {
    Swal.fire({
      title: 'Confirmar envío',
      html: `
            <p>¿Está por enviar la orden por correo electrónico a:</p>
            <p><strong>${this.ente.fullname}</strong></p>
            <p><strong>${this.ente.email}</strong></p>
        `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { this.sendEmailWithPDF(pdfBlob); }
      else { this.emailButtonDisabled = false; this.cdr.detectChanges(); }
    });
  }

  sendEmailWithPDF = async (pdfBlob: Blob): Promise<void> => {
    if (!pdfBlob.size) { Swal.fire('Error', 'No se pudo generar el PDF correctamente', 'error').then(() => { this.emailButtonDisabled = false; this.cdr.detectChanges(); }); return; }
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `castel-cotizacion_${this.sale.entecode}_${dateStr}.pdf`;
    const formData = new FormData();
    formData.append('email', 'webmaster@esparzagarza.mx');
    formData.append('file', pdfBlob, filename);

    this.repositoryService.sendEmailWithPDF(formData).subscribe({
      next: (resp: boolean) => {
        Swal.fire(
          resp ? 'Éxito' : 'Error',
          resp ? 'El correo fue enviado exitosamente' : 'No se pudo enviar el correo',
          resp ? 'success' : 'error'
        );
        this.emailButtonDisabled = false;
        this.cdr.detectChanges();
      },
      error: () => { Swal.fire('Error', 'No se pudo enviar el correo', 'error').then(() => { this.emailButtonDisabled = false; this.cdr.detectChanges(); }); }
    });
  };

  printInfo(): void {
    if (!this.infoComponent) {
      this.setActiveSection('info');
      setTimeout(() => { if (this.infoComponent) { this.printInfoContent(); } }, 100);
    } else { this.printInfoContent(); }
  }

  private printInfoContent(): void {
    const printContent = this.infoComponent.printableContent();
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    const folio = this.sale.folio;
    const fileName = `CASTEL_OrdenCotizacion#${folio}`;

    if (WindowPrt) {
      const styles = `
            <style>
                @page {
                    margin: 0.5cm;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 1em;
                }
                .text-left { text-align: left !important; }
                .text-right { text-align: right !important; }
                .text-center { text-align: center !important; }
                .text-gray-600 { color: #6c757d !important; }
                .text-info { color: #17a2b8 !important; }
                .text-primary { color: #007bff !important; }
                .text-success { color: #28a745 !important; }
                .text-warning { color: #ffc107 !important; }
                .fw-semibold { font-weight: 600 !important; }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.7em;
                }
                .table td, .table th {
                    padding: 0.75rem;
                    vertical-align: top;
                }
                .card {
                    padding: 10px;
                    font-size: 0.7em;
                }
                .card-flush {
                    border: 0;
                    font-size: 0.7em;
                }
                /* Bordes específicos */
                .custom-border-left { border-left: 1px solid #dee2e6 !important; }
                .custom-border-right { border-right: 1px solid #dee2e6 !important; }
                .custom-border-top { border-top: 1px solid #dee2e6 !important; }
                .custom-border-bottom { border-bottom: 1px solid #dee2e6 !important; }
                .custom-border-left-top { border-left: 1px solid #dee2e6 !important; border-top: 1px solid #dee2e6 !important; }
                .custom-border-right-top { border-right: 1px solid #dee2e6 !important; border-top: 1px solid #dee2e6 !important; }
                .no-border { border: none !important; }
                .full-border { border: 1px solid #dee2e6 !important; }
            </style>
        `;

      WindowPrt.document.write(`
            <html>
                <head><title>${fileName}</title>${styles}</head>
                <body>${printContent}</body>
            </html>
        `);

      WindowPrt.document.close();
      WindowPrt.focus();

      WindowPrt.onload = () => {
        setTimeout(() => {
          WindowPrt.print();
          WindowPrt.onafterprint = () => {
            WindowPrt.close();
          };
        }, 300);
      };
    }
  }
}