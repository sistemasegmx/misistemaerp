import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private castelAccess = environment.modules.casteluseraccess;

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser || !currentUser.id) { this.authService.logout(); return false; }

    if (route.data['roles'] && route.data['roles'].includes('admin')) {
      if (currentUser.type !== 'admin') { this.router.navigate(['/dashboard']); return false; }
    }

    if (route.data['requiresCastelAccess']) {
      if (!this.castelAccess.includes(currentUser.id.toString())) { this.router.navigate(['/dashboard']); return false; }
    }

    return true;
  }
}
