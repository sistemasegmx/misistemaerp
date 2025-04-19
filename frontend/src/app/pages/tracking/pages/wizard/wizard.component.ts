import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ISale } from 'src/app/pages/interfaces/isale';
import { ISaleHistory } from 'src/app/pages/interfaces/isalehistory';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import Swal from "sweetalert2";
import { StepperComponent } from "src/app/_metronic/kt/components";
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html'
})
export class WizardComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() searchData: any;

  @Output() beginNewSearch = new EventEmitter();
  @ViewChild("myStepper") myStepperEl: ElementRef;

  user!: UserModel;
  sale: ISale = {} as ISale;
  module: string = 'salehistory';
  loadingSale: boolean = false;
  saleItems: ISaleItems[] = [];
  saleHistory: ISaleHistory[] = [];
  baseUrl = environment.baseUrl;
  isOnFinalSaleStep: boolean = false;
  salestatus = environment.modules.salestatus;
  trackingnumber: string = '';
  historyComments: string = '';


  prevSaleStep: string | null = null;
  nextSaleStep: string | null = null;
  stepperController: StepperComponent | null = null;

  steps = [
    'orden creada',
    'orden recibida',
    'orden procesada',
    'material-in-transit',
    'recibo bodega usa',
    'proceso de importacion',
    'recibido bodega tijuana',
    'finalizada'
  ];

  stepsIcons = [
    "fa fa-shopping-cart",
    "fa fa-check-circle",
    "fa fa-box",
    "fa fa-truck",
    "fa fa-warehouse",
    "fa fa-map-marker-alt",
    "fa fa-warehouse",
    "fa fa-check"
  ];

  userMap: { [key: string]: string } = {};

  editingTracking: boolean = false;
  tempTrackingNumber: string = '';
  isRefreshing: boolean = false;

  constructor(
    private authService: AuthService,
    private repository: RepositoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;

      this.route.paramMap.subscribe(params => {
        const folio = params.get('folio');
        if (folio) { this.loadData(folio); }
      });
    });
  }


  ngAfterViewInit() {
    if (this.myStepperEl) {
      this.stepperController = new StepperComponent(this.myStepperEl.nativeElement, {
        startIndex: 1,
        animation: false,
        animationSpeed: '0.3s',
        animationNextClass: 'animate__animated animate__slideInRight animate__fast',
        animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast',
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void { if (changes['searchData'] && changes['searchData'].currentValue) { this.loadData(changes['searchData'].currentValue); } }

  refreshData(): void {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    this.cdr.detectChanges();

    this.route.paramMap.subscribe(params => {
      const folio = params.get('folio');
      if (folio) {
        this.loadData(folio, () => {
          this.isRefreshing = false;
          this.cdr.detectChanges();
        });
      }
    });
  }


  loadData(folio: string, callback?: () => void): void {
    if (!this.user) { if (callback) callback(); return; }

    this.loadingSale = true;
    const payload = {
      accountid: this.user.accountid,
      type: 'compra',
      folio: folio, // ✅ Usamos directamente el folio
      limitqty: 1,
      ascending: 'desc'
    };

    this.repository.getAllDataFiltered('sale', payload)
      .pipe(
        switchMap((resp: ISale[]) => {
          if (resp.length === 0) {
            this.loadingSale = false;
            if (callback) callback();
            return of({ items: [], history: [], staffes: [] });
          }
          const sale = resp[0];
          this.sale = sale;
          this.mapSaleStatus();
          this.nextSaleStep = this.getSaleNextStatus();
          this.prevSaleStep = this.getSalePrevStatus();
          this.stepperController?.goto(this.steps.indexOf(sale.status) + 1);
          if (this.stepperController?.getCurrentStepIndex() === 8) { this.isOnFinalSaleStep = true; }
          if (sale.id) {
            return forkJoin({
              items: this.loadSaleItems(sale.id),
              history: this.loadSaleHistory(sale.id),
              staffes: this.loadStaffes()
            });
          }
          return of({ items: [], history: [], staffes: [] });
        }),
        tap((result: { items: ISaleItems[], history: ISaleHistory[], staffes: IUser[] }) => {
          this.saleItems = result.items ?? [];
          this.saleHistory = result.history ?? [];
          this.userMap = result.staffes.reduce((map, user) => { map[Number(user.id)] = user.fullname; return map; }, {} as { [key: number]: string });
          this.cdr.detectChanges();
        }),
        catchError((error) => { this.loadingSale = false; return of({ items: [], history: [], staffes: [] }); })
      )
      .subscribe({
        next: () => {
          this.loadingSale = false;
          if (callback) callback();
        },
        error: () => {
          this.loadingSale = false;
          if (callback) callback();
        }
      });
  }

  private loadSaleItems(saleId: string) { return this.repository.getListByColumn('saleitems', 'saleid', saleId).pipe(tap((items: ISaleItems[]) => { })); }
  private loadSaleHistory(saleId: string) { return this.repository.getListByColumn('salehistory', 'saleid', saleId).pipe(tap((history: ISaleHistory[]) => { })); }
  private loadStaffes() { return this.repository.getAllData('user').pipe(tap((history: IUser[]) => { })); }

  addSaleHistoryEntry(status: string): void {
    const currentStatus = this.salestatus.find(s => s.status === status);
    const payload = {
      saleid: this.sale.id,
      status: status,
      description: currentStatus ? currentStatus.description : '',
      module: 'tracking',
      action: 'status',
      comments: this.historyComments
    };
    this.repository.postItem('salehistory', payload).subscribe({
      next: () => { this.cdr.detectChanges(); },
      error: () => Swal.fire('Error', 'No se pudo actualizar el historial', 'error')
    });
  }

  isNextStepValid(): boolean { return this.sale.status !== null && this.steps.includes(this.sale.status); }

  closeSale(): void {
    this.repository.putItem('sale', { id: this.sale.id, status: 'finalizada' })
      .subscribe({
        next: (resp) => resp === 200 && (this.isOnFinalSaleStep = true),
        error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
      });
  }

  public handleStepperNavigation(action: "next" | "prev"): void {
    if (!this.stepperController) return;
    const nextStep = action === "next" ? this.nextSaleStep : this.prevSaleStep;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Este cambio cambiará el proceso de la orden a <strong>${nextStep}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, mover proceso a ${nextStep}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      if (nextStep === 'recibo bodega usa') {
        this.saleItems.forEach(item => {
          this.repository.patchItem('saleitems', { id: item.id, delivered1: item.delivered1 }).subscribe();
        });
      }

      if (nextStep === 'proceso de importacion') {
        this.saleItems.forEach(item => {
          this.repository.patchItem('saleitems', { id: item.id, delivered2: item.delivered2 }).subscribe();
        });
      }

      if (nextStep === 'recibido bodega tijuana') {
        this.saleItems.forEach(item => {
          this.repository.patchItem('saleitems', { id: item.id, delivered3: item.delivered3 }).subscribe();
        });
      }

      const payload: any = { id: this.sale.id, status: nextStep };
      if (nextStep === 'material-in-transit') { payload.trackingnumber = this.trackingnumber; }

      this.repository.putItem("sale", payload)
        .pipe(
          switchMap(resp => resp === 200
            ? this.repository.postItem('salehistory', {
              saleid: this.sale.id,
              status: nextStep,
              description: this.salestatus.find(s => s.status === nextStep)?.description || '',
              module: 'tracking',
              action: action === "next" ? 'avance' : 'retroceso',
              comments: this.historyComments
            }) : of(null)
          ),
          switchMap(historyResp => historyResp ? this.loadSaleHistory(this.sale.id) : of([]))
        )
        .subscribe({
          next: updatedHistory => {
            if (updatedHistory) {
              this.saleHistory = updatedHistory;
              Swal.fire({ title: `Proceso de ${this.sale.type} actualizado correctamente`, icon: "success" });
            }
            if (this.stepperController) { this.stepperController[action === "next" ? 'goNext' : 'goPrev'](); }
            this.patchSale("status", payload.status ?? "");
            this.mapSaleStatus();
            this.nextSaleStep = this.getSaleNextStatus();
            this.prevSaleStep = this.getSalePrevStatus();
            this.isOnFinalSaleStep = this.stepperController?.getCurrentStepIndex() === 8;
            this.historyComments = '';
            this.cdr.detectChanges();
          },
          error: () => Swal.fire('Error', 'No se pudo actualizar el proceso o el historial de la orden', 'error')
        });
    });
  }

  public getSaleStatusDescription(saleStatus: string): string { return environment.modules.salestatus.find(el => el.status === saleStatus)?.description ?? ""; }
  private patchSale(key: keyof ISale, value: string): void { if (this.sale[key] === undefined || this.sale[key] === null) return; this.sale[key] = value; }
  private getSaleNextStatus(): string { return this.steps[this.steps.indexOf(this.sale.status) + 1] }
  private getSalePrevStatus(): string { return this.steps[this.steps.indexOf(this.sale.status) - 1] }
  private mapSaleStatus(): void { for (let i = 0; i < this.steps.length; i++) { if (this.salestatus.filter(s => s.status == this.steps[i]).some(el => el.status === this.sale.status)) { this.sale.status = this.steps[i]; break; } } return; }

  printInfo(): void {
    const printContent = document.getElementById('infoComponentContent')?.innerHTML || '';
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

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
          <head><title>MiSistemaERP_Tracking: ${this.sale.type.charAt(0).toUpperCase() + this.sale.type.slice(1)} #${this.sale.id}</title>${styles}</head>
          <body>
          <h1>MiSistemaERP_Tracking: ${this.sale.type.charAt(0).toUpperCase() + this.sale.type.slice(1)} #${this.sale.id}</h1>
          ${printContent}
          </body>
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

  editTrackingNumber() { this.tempTrackingNumber = this.sale.trackingnumber; this.editingTracking = true; }

  saveTrackingNumber() {
    const payload = { id: this.sale.id, trackingnumber: this.tempTrackingNumber, status: 'material-in-transit' };

    this.repository.putItem("sale", payload).pipe(
      switchMap(resp => {
        if (resp === 200) {
          return this.repository.postItem('salehistory', {
            saleid: this.sale.id,
            status: 'material-in-transit',
            description: `Número de rastreo actualizado a: ${this.tempTrackingNumber}`,
            module: 'tracking',
          });
        }
        return of(null);
      })
    ).subscribe({
      next: historyResp => {
        if (historyResp) {
          this.loadData(this.searchData); Swal.fire('Actualizado', 'El número de rastreo y el historial fueron actualizados correctamente.', 'success');
        } else { Swal.fire('Error', 'No se pudo actualizar el historial.', 'error'); }
        this.editingTracking = false;
      },
      error: () => { Swal.fire('Error', 'No se pudo actualizar el número de rastreo o el historial.', 'error'); this.editingTracking = false; }
    });
  }

  cancelEditTrackingNumber() {
    this.editingTracking = false;
    this.tempTrackingNumber = '';
  }
}