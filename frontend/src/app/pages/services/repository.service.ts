import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, finalize, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RepositoryHTTPService } from './repository-http/repository-http.service';
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import { IResponse } from '../interfaces/iresponse';

@Injectable({ providedIn: 'root', })

export class RepositoryService implements OnDestroy {

  private unsubscribe: Subscription[] = [];
  private authLocalStorageAToken = `${environment.aToken}`;

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private repositoryHttpService: RepositoryHTTPService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageAToken);
      return !lsValue ? undefined : JSON.parse(lsValue);
    } catch (error) { console.error(error); return undefined; }
  }

  private jsonToString(obj: any): string {
    return Object.keys(obj)
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }

  getOneById(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getOneById(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getOneByColumn(module: string, field: string, value: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);
    return this.repositoryHttpService.getOneByColumn(auth.access_token, module, field, value)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllData(module: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllData(auth.access_token, module)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataPaginated(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataPaginated(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataHistoryReport(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);


    return this.repositoryHttpService.getAllDataHistoryReport(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataTraceabilityReport(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);


    return this.repositoryHttpService.getAllDataTraceabilityReport(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataPaginatedReport(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);


    return this.repositoryHttpService.getAllDataPaginatedReport(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataPaginatedByLike(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataPaginatedByLike(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataPaginatedBySaleItemsCompra(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataPaginatedBySaleItemsCompra(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataPaginatedBySaleItemsRecibo(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataPaginatedBySaleItemsRecibo(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataFiltered(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataFiltered(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getAllDataFilteredByRange(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getAllDataFilteredByRange(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getListByColumn(module: string, field: string, value: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);
    return this.repositoryHttpService.getListByColumn(auth.access_token, module, field, value)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getListByLike(module: string, field: string, value: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);
    return this.repositoryHttpService.getListByLike(auth.access_token, module, field, value)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getPreByLike(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getPreByLike(auth.access_token, module, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getCountDataFiltered(module: string, body: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getCountDataFiltered(auth.access_token, module, body)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getConvertImageToBase64(body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.getConvertImageToBase64(auth.access_token, this.jsonToString(body))
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getCountsByItem(module: string, field: string, value: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);
    return this.repositoryHttpService.getCountsByItem(auth.access_token, module, field, value)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getRecentsByItem(module: string, field: string, value: string): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);
    return this.repositoryHttpService.getRecentsByItem(auth.access_token, module, field, value)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  postItem(module: string, body: {}): Observable<any> {

    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.postItem(auth.access_token, module, body)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  putItem(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.putItem(auth.access_token, module, body)
      .pipe(
        map((resp: IResponse) => { return resp.status; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  patchItem(module: string, body: {}): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.patchItem(auth.access_token, module, body)
      .pipe(
        map((resp: IResponse) => { return resp.status; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteItem(module: string, id: any): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.deleteItem(auth.access_token, module, id)
      .pipe(
        map((resp: IResponse) => { return resp.status; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  uploadFile(body: FormData) {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.uploadFile(auth.access_token, body)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? resp.data : {}; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  sendEmailWithPDF(body: FormData) {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) return of(undefined);
    this.isLoadingSubject.next(true);

    return this.repositoryHttpService.sendEmailWithPDF(auth.access_token, body)
      .pipe(
        map((resp: IResponse) => { return resp.status === 200 ? true : false; }),
        catchError(err => of(err.error.message)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  ngOnDestroy() { this.unsubscribe.forEach((sb) => sb.unsubscribe()); }
}
