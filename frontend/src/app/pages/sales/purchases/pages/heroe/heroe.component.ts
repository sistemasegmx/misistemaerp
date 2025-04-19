import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { InfoComponent } from '../info/info.component';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import Swal from 'sweetalert2';
import { ExportService } from 'src/app/pages/services/export.service';
import { firstValueFrom, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit, AfterViewInit {

  @ViewChild(InfoComponent, { static: false }) infoComponent!: InfoComponent;

  heroe: ISale = {} as ISale;
  user: UserModel = {} as UserModel;
  staff: IUser = {} as IUser;
  selectedEnte: IEnte = {} as IEnte;
  cartItems: ISaleItems[] = [];
  calculatedValues = { subtotal: 0, taxAmount: 0, total: 0, due: 0 };
  emailButtonDisabled = true;
  salestatus = environment.modules.salestatus;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private exportService: ExportService
  ) {
    this.initializeEnte();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.route.paramMap.subscribe(params => {
      const saleId = params.get('id');
      if (saleId) this.loadData(saleId);
    });
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

  private loadData(saleId: string): void {
    this.repositoryService.getOneById('sale', { id: saleId }).subscribe({
      next: (sale: ISale) => {
        this.heroe = sale;
        this.loadEnteData(sale.enteid);
        if (sale.created_by) this.loadStaffData(sale.created_by);
        this.loadCartItems(sale.id);
        this.calculateTotal();
      },
      error: (error) => console.error('Error loading sale data:', error)
    });
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.initializeHeroe();
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      saleid: '',
      accountid: this.user.accountid,
      enteid: '',
      enteorder: '',
      entecode: '',
      entename: 'Sin Asignar',
      currency: '',
      parity: '',
      taxname: '',
      taxamount: '',
      subtotal: '',
      total: '',
      cost: '',
      paid: '',
      paymentmethod: 'efectivo',
      salename: '',
      type: 'compra',
      countrycode: '',
      items: '',
      startdate: '',
      enddate: '',
      description: '',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private initializeEnte(): void {
    this.selectedEnte = {
      id: '',
      accountid: '',
      code: '',
      fullname: '',
      nationality: '',
      rfc: '',
      fiscalname: '',
      fulladdress: '',
      email: '',
      phone: '',
      level: '',
      type: '',
      image: '/assets/img/nofoto.png',
      status: '',
      created_by: '',
      modified_by: ''
    };
  }

  private loadEnteData(enteId: string): void {
    this.repositoryService.getOneById('ente', { id: enteId }).subscribe({
      next: (ente: IEnte) => {
        this.selectedEnte = ente;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading data:', error)
    });
  }

  private loadStaffData(staffId: string): void {
    this.repositoryService.getOneById('user', { id: staffId }).subscribe({
      next: (staff: IUser) => {
        this.staff = staff;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading data:', error)
    });
  }

  private loadCartItems(saleId: string): void {
    this.repositoryService.getListByColumn('saleitems', 'saleid', saleId).subscribe({
      next: (items: ISaleItems[]) => {
        this.cartItems = items;
        this.calculateTotal();
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading data:', error)
    });
  }

  private calculateTotal(): void {
    const taxRate = parseFloat(this.heroe.taxamount) || 0;
    const subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.qty || 1;
      return sum + (price * quantity);
    }, 0);
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    const paidAmount = parseFloat(this.heroe.paid || '0');
    this.calculatedValues = { subtotal, taxAmount, total: totalAmount, due: totalAmount - paidAmount };
  }

  changeStatusSale(status: string): void {
    const payload = { id: this.heroe.id, status: status };
    this.repositoryService.putItem('sale', payload).pipe(
      switchMap(() => {
        const currentStatus = this.salestatus.find(s => s.status === status);
        const saleHistoryPayload = {
          saleid: this.heroe.id,
          status: status,
          description: currentStatus ? currentStatus.description : '',
          module: 'orden',
          action: 'status'
        };
        return this.repositoryService.postItem('salehistory', saleHistoryPayload);
      })
    ).subscribe({
      next: () => {
        this.heroe.status = status;
        this.cdr.detectChanges();
        this.router.navigate(['movimiento-de-compra/' + this.heroe.id]);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro o el historial', 'error')
    });
  }

  closeSale(): void {
    this.repositoryService.putItem('sale', { id: this.heroe.id, status: 'finalizada' }).subscribe({
      next: (resp) => resp === 200 && this.repositoryService.postItem('salehistory', {
        saleid: this.heroe.id, status: 'finalizada',
        description: this.salestatus.find(s => s.status === 'finalizada')?.description || '',
        module: 'orden', action: 'status'
      }).subscribe(() => (this.printInfo(), this.router.navigate(['movimiento-de-compra/' + this.heroe.id]))),
      error: () => Swal.fire('Error', 'No se pudo actualizar el estado o guardar el historial', 'error')
    });
  }

  sendEmail = async (): Promise<void> => {
    this.emailButtonDisabled = true;
    this.cdr.detectChanges();
    const pdfBlob = await this.exportService.generatePDFBlob('#my-table');
    if (pdfBlob) { this.confirmSendEmail(pdfBlob); }
    else { Swal.fire('Error', 'No se pudo generar el PDF', 'error').then(() => { this.emailButtonDisabled = false; this.cdr.detectChanges(); }); }
  };

  confirmSendEmail(pdfBlob: Blob): void {
    Swal.fire({
      title: 'Confirmar envío',
      html: `
            <p>¿Está por enviar la orden por correo electrónico a:</p>
            <p><strong>${this.selectedEnte.fullname}</strong></p>
            <p><strong>${this.selectedEnte.email}</strong></p>
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
    const filename = `compra_${this.heroe.entecode}_${dateStr}.pdf`;
    const formData = new FormData();
    formData.append('email', this.selectedEnte.email);
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
    if (!this.infoComponent) setTimeout(() => this.infoComponent && this.printInfoContent(), 100);
    else this.printInfoContent();
  }

  private printInfoContent(): void {
    const printContent = this.infoComponent.printableContent();
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    const folio = this.heroe.folio;
    const fileName = `MiSistemaERP_OrdenCompra#${folio}`;

    if (WindowPrt) {
      const styles = `
        <style>
          @page { margin: 0.5cm; }
          body { font-family: Arial, sans-serif; font-size: 1em; }
          .text-left { text-align: left !important; }
          .text-right { text-align: right !important; }
          .text-center { text-align: center !important; }
          .text-gray-600 { color: #6c757d !important; }
          .text-info { color: #17a2b8 !important; }
          .text-primary { color: #007bff !important; }
          .text-success { color: #28a745 !important; }
          .text-warning { color: #ffc107 !important; }
          .fw-semibold { font-weight: 600 !important; }
          .table { width: 100%; border-collapse: collapse; font-size: 0.7em; }
          .table td, .table th { padding: 0.75rem; vertical-align: top; }
          .card { padding: 10px; font-size: 0.7em; }
          .card-flush { border: 0; font-size: 0.7em; }
          .custom-border-left { border-left: 1px solid #dee2e6 !important; }
          .custom-border-right { border-right: 1px solid #dee2e6 !important; }
          .custom-border-top { border-top: 1px solid #dee2e6 !important; }
          .custom-border-bottom { border-bottom: 1px solid #dee2e6 !important; }
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
          WindowPrt.onafterprint = () => WindowPrt.close();
        }, 300);
      };
    }
  }

  trackOrder(): void { this.heroe?.folio ? this.router.navigate(['/rastreo-de-ordenes', this.heroe.folio]) : console.warn('Folio no disponible'); }

}
