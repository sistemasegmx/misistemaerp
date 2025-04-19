import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { RepositoryService } from 'src/app/pages/services/repository.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html'
})
export class ResumenComponent implements OnInit {
  @Input() heroe: any;

  user!: UserModel;
  taskSummary: any[] = [];
  groupedTasks: Record<string, any[]> = {};
  recentClients: any[] = [];
  recentRemissions: any[] = [];
  recentSuppliers: any[] = [];
  totalTasks = 0;

  orderTypes = ['cotizacion', 'compra', 'remision', 'bodega-usa', 'proceso-importacion', 'bodega-tijuana'];

  statusOrder = [
    'activo', 'borrador', 'atendiendo', 'orden creada', 'orden recibida',
    'orden procesada', 'material-in-transit', 'recibo bodega usa',
    'proceso de importacion', 'recibido bodega tijuana', 'finalizada'
  ];

  constructor(
    private authService: AuthService,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe(user => { this.user = user; if (this.heroe?.id) this.loadResume(); });
    window.addEventListener('updateData', this.handleUpdateData.bind(this));
  }

  ngOnDestroy(): void { window.removeEventListener('updateData', this.handleUpdateData.bind(this)); }

  handleUpdateData(): void { setTimeout(() => { this.loadResume(); }, 50); }

  private loadResume(): void {
    if (!this.heroe?.id) return;

    this.repositoryService.getCountsByItem('saleitems', 'itemid', this.heroe.id).subscribe({
      next: ({ data }) => {
        this.taskSummary = Array.isArray(data) ? data : [];
        this.totalTasks = this.taskSummary.reduce((sum, { total }) => sum + total, 0);
        this.groupTasks();
        this.cdr.detectChanges();
      },
      error: () => this.resetSummary()
    });

    this.repositoryService.getRecentsByItem('saleitems', 'itemid', this.heroe.id).subscribe({
      next: ({ clients_cotizacion, clients_remision, suppliers }) => {
        this.recentClients = clients_cotizacion || [];
        this.recentRemissions = clients_remision || [];
        this.recentSuppliers = suppliers || [];
        this.cdr.detectChanges();
      },
      error: () => this.resetRecents()
    });
  }

  private groupTasks(): void {
    this.groupedTasks = this.orderTypes.reduce((acc, type) => {
      acc[type] = this.groupByStatus(this.taskSummary.filter(task => task.type === type));
      return acc;
    }, {} as Record<string, any[]>);
  }

  private groupByStatus(tasks: any[]): any[] {
    return tasks.sort((a, b) => {
      let indexA = this.statusOrder.indexOf(a.status);
      let indexB = this.statusOrder.indexOf(b.status);
      return (indexA === -1 ? this.statusOrder.length : indexA) - (indexB === -1 ? this.statusOrder.length : indexB);
    });
  }

  private resetSummary(): void { this.taskSummary = []; this.totalTasks = 0; this.groupedTasks = {}; }
  private resetRecents(): void { this.recentClients = []; this.recentRemissions = []; this.recentSuppliers = []; }
  getStatusClass(status: string): string { return `badge-light-${status.replace(/\s+/g, '-').toLowerCase()}`; }
}
