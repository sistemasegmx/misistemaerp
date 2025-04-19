import { Component } from '@angular/core';
import { AuthService, UserModel } from 'src/app/modules/auth';

@Component({
  selector: 'app-menusistema',
  templateUrl: './menusistema.component.html'
})
export class MenusistemaComponent {

  user!: UserModel;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void { this.subscribeToCurrentUser(); }

  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }

}
