import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ISale } from 'src/app/pages/interfaces/isale';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  user!: UserModel;
  allSales: ISale[] = [];
  baseUrl = environment.baseUrl;

  cotizacionCount: number = 0;
  compraCount: number = 0;
  remisionCount: number = 0;
  progressPercentage: number = 0;
  currentMonthName: string = '';
  monthNames = environment.modules.basemonths;

  constructor(
    private authService: AuthService,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentMonthName = this.monthNames[new Date().getMonth()];
  }

  ngOnInit(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; this.loadSalesData(this.user.id); }); }

  private loadSalesData(userId: string): void {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

    const payload = {
      created_by: userId,
      startDate,
      endDate
    };

    this.repositoryService.getAllDataFilteredByRange('sale', payload).subscribe({
      next: (sales: ISale[]) => {
        this.allSales = sales;
        this.calculateSaleTypes();
        this.cdr.detectChanges();
      },
      error: (err) => { console.error('Error loading data:', err); }
    });
  }

  private calculateSaleTypes(): void {
    this.cotizacionCount = this.allSales.filter(sale => sale.type === 'cotizacion').length;
    this.compraCount = this.allSales.filter(sale => sale.type === 'compra').length;
    this.remisionCount = this.allSales.filter(sale => sale.type === 'remision').length;
    this.calculateProgress();
  }

  private calculateProgress(): void {
    this.progressPercentage = this.cotizacionCount > 0
      ? Math.min((this.compraCount / this.cotizacionCount) * 100, 100)
      : 0;
  }
}
