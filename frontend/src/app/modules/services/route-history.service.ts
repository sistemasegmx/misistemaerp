import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteHistoryService {
  private history:any = [];
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
   }

   public getPreviousUrl(defaultUrl: string) {
    return this.history[this.history.length - 2] || defaultUrl;
  }




}
