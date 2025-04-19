import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AuthService, UserModel } from 'src/app/modules/auth';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {

  user!: UserModel;

  castelAccess = environment.modules.casteluseraccess;

  constructor(private authService: AuthService,) { }

  ngOnInit(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }
}
