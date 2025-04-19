import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel, AuthResponse, FormatResponse } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export type UserType = UserModel;

@Injectable({ providedIn: 'root', })

export class AuthService implements OnDestroy {

  private unsubscribe: Subscription[] = [];
  private authLocalStorageAToken = `${environment.aToken}`;
  private authLocalStorageRToken = `${environment.rToken}`;

  currentuser: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType { return this.currentUserSubject.value; }
  set currentUserValue(user: UserType) { this.currentUserSubject.next(user); }

  constructor(private authHttpService: AuthHTTPService, private router: Router) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(new UserModel);
    this.currentuser = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  getOneById(module: string, id: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.authHttpService.getOneById(auth.access_token, module, id)
      .pipe(
        map((resp: FormatResponse) => { return resp?.status === 200 ? resp.data : {}; }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password)
      .pipe(
        map((auth: AuthModel) => { this.logout(); return this.setAuthFromLocalStorage(auth); }),
        switchMap(() => this.getUserByToken()),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) { this.logout(); return of(new UserModel) };
    this.isLoadingSubject.next(true);

    return this.authHttpService.getUserByToken(auth.access_token)
      .pipe(
        map((authResponse: AuthResponse) => {
          if (authResponse.status === 200) this.currentUserSubject.next(authResponse.data);
          else this.logout();
          return authResponse.data;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }


  registration(fullname: string, email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.registration(fullname, email, password)
      .pipe(
        map((resp: FormatResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  forgotPassword(email: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.forgotPassword(email)
      .pipe(
        map((resp: FormatResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageAToken);
    localStorage.removeItem(this.authLocalStorageRToken);
    this.router.navigate(['/auth/login'], { queryParams: {}, });
  }


  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    if (auth && auth.access_token) {
      localStorage.setItem(this.authLocalStorageAToken, JSON.stringify(auth));
      localStorage.setItem(this.authLocalStorageRToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageAToken);
      return !lsValue ? undefined : JSON.parse(lsValue);
    } catch (error) { console.error(error); return undefined; }
  }

  ngOnDestroy() { this.unsubscribe.forEach((sb) => sb.unsubscribe()); }
}
