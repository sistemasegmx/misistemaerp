import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IPayment } from 'src/app/pages/interfaces/ipayment';
import { ISale } from 'src/app/pages/interfaces/isale';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';

type Tabs = 'tab_1' | 'tab_2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit {

  filename: string = '';
  module: string = 'user';
  heroe!: IUser;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  baseroles = environment.modules.baseroles;
  months = environment.modules.basemonths;
  itemId: string | null = null;

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
          if (resp && resp.id) { this.heroe = resp; }
          this.cdr.detectChanges();
        },
        error: (err) => { console.error('Error loading hero data:', err); }
      });
  }
}
