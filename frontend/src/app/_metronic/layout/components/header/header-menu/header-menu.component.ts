import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {

  user!: UserModel;
  castelAccess = environment.modules.casteluseraccess;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }

  calculateMenuItemCssClass(url: string): string { return this.checkIsActive(this.router.url, url) ? 'active' : ''; }

  private checkIsActive(pathname: string, url: string): boolean {
    const current = this.getCurrentUrl(pathname);
    return current === url || current.includes(url);
  }

  private getCurrentUrl(pathname: string): string { return pathname.split(/[?#]/)[0]; }
}
