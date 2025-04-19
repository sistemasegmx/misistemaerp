import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IPayment } from 'src/app/pages/interfaces/ipayment';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

type Tabs = 'tab_1' | 'tab_2';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html'
})
export class RecentComponent implements OnInit {

  filename: string = '';
  module: string = 'user';
  heroe!: IUser;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  baseroles = environment.modules.baseroles;
  months = environment.modules.basemonths;
  itemId: string | null = null;
  enteCache: { [key: string]: IEnte } = {};

  activeTab: Tabs = 'tab_1';
  currentYear: string = new Date().getFullYear().toString();
  currentMonth: number = new Date().getMonth();

  allHistorySale: ISale[] = [];
  allHistoryPayment: IPayment[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToRouteParams();
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.initializeHeroe();
    });
  }

  private subscribeToRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) {
        this.loadHeroeData(this.itemId);
      }
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      accountid: this.user.accountid,
      employeeid: '',
      email: '',
      username: '',
      password: '',
      fullname: '',
      phone: '',
      description: '',
      lastlogin: '',
      type: 'admin',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id })
      .subscribe({
        next: (resp: IUser) => {
          if (resp && resp.id) {
            this.heroe = resp;
            this.loadHistoryData('sale', 'allHistorySale');
            this.loadHistoryData('payment', 'allHistoryPayment');
          }
          this.cdr.detectChanges();
        },
        error: (err) => { console.error('Error loading hero data:', err); }
      });
  }

  setTab(tab: Tabs) { this.activeTab = tab; }
  activeClass(tab: Tabs) { return tab === this.activeTab ? 'show active' : ''; }

  private loadHistoryData(type: string, targetArray: 'allHistorySale' | 'allHistoryPayment'): void {
    const payload = {
      "created_by": this.heroe.id,
      "pyear": this.currentYear,
      "pmonth": this.months[0],
      "limitqty": 10,
      "ascending": "desc"
    }
    this.repositoryService.getAllDataFiltered(type, payload)
      .subscribe({
        next: (result) => {
          this[targetArray] = result;
          this.loadEnteNames();
          this.cdr.detectChanges();
        },
        error: (err) => { console.error(`Error loading ${type} data:`, err); }
      });
  }

  private loadEnteNames(): void {
    this.allHistorySale.forEach(sale => {
      if (sale.enteid && !this.enteCache[sale.enteid]) {
        this.repositoryService.getOneById('ente', { id: sale.enteid }).subscribe({
          next: (resp: IEnte) => {
            this.enteCache[sale.enteid] = resp;
            this.cdr.detectChanges();
          },
          error: (error) => { console.error('Error loading data:', error); }
        });
      }
    });
  }

  getEnteName(enteid: string): string { return this.enteCache[enteid]?.fiscalname || ''; }
  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';
}
