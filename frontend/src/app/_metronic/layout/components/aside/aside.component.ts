import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent, DrawerComponent, ToggleComponent, ScrollComponent } from '../../../kt/components';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll!: ElementRef;
  private subscriptions: Subscription[] = [];

  asideTheme = '';
  asideMinimize = false;
  asideMenuCSSClasses = '';

  constructor(private layout: LayoutService, private router: Router) { }

  ngOnInit(): void {
    this.initializeLayout();
    this.setupRoutingChanges();
  }

  private initializeLayout(): void {
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
  }

  private setupRoutingChanges(): void {
    const routerSubscription = this.router.events.subscribe((event) => { if (event instanceof NavigationEnd || event instanceof NavigationCancel) { this.reinitializeMenu(); } });
    this.subscriptions.push(routerSubscription);
  }

  private reinitializeMenu(): void {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      this.ktAsideScroll?.nativeElement.scrollTo({ top: 0 });
    }, 50);
  }  

  private showBranchChangeConfirmation(branchName: string, branchUrl: string, branchLogo: string): void {
    Swal.fire({
      title: '¿Desea cambiar de sucursal?',
      html: `
        <div>
          <p>Será redirigido a <strong>${branchName}</strong>.</p>
          <img src="${branchLogo}" alt="Logo ${branchName}" style="width: 100px; margin-top: 10px;">
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = branchUrl;
      }
    });
  }

  ngOnDestroy(): void { this.subscriptions.forEach((subscription) => subscription.unsubscribe()); }
}
