import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit {

  user!: UserModel;
  heroe: IEnte = {} as IEnte;
  sales: ISale[] = [];
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  itemId: string | null = null;
  allSellers: IUser[] = [];
  selectedSeller: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repository: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) {
        this.loadHeroe(this.itemId);
        this.loadHeroeSales(this.itemId);
      }
    });
  }

  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }

  private loadHeroe(id: string): void {
    forkJoin({
      allSellers: this.repository.getAllData('user') as Observable<IUser[]>,
      heroeData: this.repository.getOneById('ente', { id }) as Observable<IEnte>
    }).subscribe({
      next: ({ allSellers, heroeData }) => {
        this.heroe = heroeData;
        const selectedSeller = allSellers.find(seller => seller.id === heroeData.staffid);
        if (selectedSeller) { this.heroe.selectedSeller = selectedSeller.fullname; }
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading data:', error); },
      complete: () => { console.log('Data loading completed'); }
    });
  }


  private loadHeroeSales(id: string): void {
    const payload = {
      "enteid": this.itemId,
      "limitqty": 10,
      "ascending": "desc"
    }
    this.repository.getAllDataFiltered('sale', payload).subscribe({
      next: (resp: ISale[]) => { this.sales = resp; this.cdr.detectChanges(); },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';
}
