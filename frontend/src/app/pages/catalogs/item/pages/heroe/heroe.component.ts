import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IItem } from 'src/app/pages/interfaces/iitem';
import { ISale } from 'src/app/pages/interfaces/isale';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit, AfterViewInit {
  user!: UserModel;
  heroe: IItem = {} as IItem;
  sales: ISale[] = [];
  saleitems: ISaleItems[] = [];
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  itemId: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) {
        this.loadHeroe(this.itemId);
        this.loadHeroeSalesItems(this.itemId);
      }
    });
  }

  ngAfterViewInit(): void { }

  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }

  private loadHeroe(id: string): void {
    this.repositoryService.getOneById('item', { id }).subscribe({
      next: (resp: IItem) => { this.heroe = resp; this.cdr.detectChanges(); },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private loadHeroeSalesItems(id: string): void {
    const payload = {
      "itemid": this.itemId,
      "limitqty": 10,
      "ascending": "desc"
    }
    this.repositoryService.getAllDataFiltered('saleitems', payload).subscribe({
      next: (resp: ISaleItems[]) => {
        this.saleitems = resp;
        this.loadSalesDetails();
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private loadSalesDetails(): void {
    const saleIds = this.saleitems.map(item => item.saleid);
    const uniqueSaleIds = [...new Set(saleIds)];
    this.sales = [];
    if (uniqueSaleIds.length === 0) { return; }
    const requests = uniqueSaleIds.map(saleId =>
      this.repositoryService.getOneById('sale', { id: saleId })
        .pipe(catchError(error => { console.error(`Error fetching sale ${saleId}:`, error); return of(null); }))
    );

    forkJoin(requests).subscribe({
      next: (responses: (ISale | null)[]) => {
        this.sales = responses
          .filter((sale): sale is ISale => sale !== null)
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });

        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading sales data:', error); }
    });
  }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }
}
