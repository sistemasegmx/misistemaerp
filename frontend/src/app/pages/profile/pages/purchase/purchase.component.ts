import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ISale } from 'src/app/pages/interfaces/isale';
import { RepositoryService } from 'src/app/pages/services/repository.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html'
})
export class PurchaseComponent implements OnInit {
  user!: UserModel;
  allData: ISale[] = [];

  constructor(
    private authService: AuthService,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; this.loadData(user.id); }); }

  private loadData(id: string): void {
    const payload = { created_by: id, type: 'compra', limitqty: 25, ascending: 'desc' };
    this.repositoryService.getAllDataFiltered('sale', payload).subscribe({
      next: (resp: ISale[]) => { this.allData = resp; this.cdr.detectChanges(); },
      error: err => console.error('Error loading sales data:', err)
    });
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getStatusClass(status: string): string { return `badge-light-${status}`; }
}
