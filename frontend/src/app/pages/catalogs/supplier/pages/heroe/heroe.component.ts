import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { ISale } from 'src/app/pages/interfaces/isale';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit, AfterViewInit {
  user!: UserModel;
  heroe: IEnte = {} as IEnte;
  sales: ISale[] = [];
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
        this.loadHeroeSales(this.itemId);
      }
    });
  }

  ngAfterViewInit(): void { }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
    });
  }

  private loadHeroe(id: string): void {
    this.repositoryService.getOneById('ente', { id }).subscribe({
      next: (resp: IEnte) => {
        this.heroe = resp;
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private loadHeroeSales(id: string): void {
    const payload = {
      "enteid": this.itemId,
      "limitqty": 10,
      "ascending": "desc"
    }
    this.repositoryService.getAllDataFiltered('sale', payload).subscribe({
      next: (resp: ISale[]) => {
        this.sales = resp;
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';

}
