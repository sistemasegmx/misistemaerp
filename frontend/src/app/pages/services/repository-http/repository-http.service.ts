import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponse } from '../../interfaces/iresponse';


@Injectable({ providedIn: 'root', })

export class RepositoryHTTPService {

  private API_URL = `${environment.baseUrl}`;

  constructor(private http: HttpClient) { }

  getAllData(token: string, module: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}`, { headers: httpHeaders });
  }

  getAllDataPaginated(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/paginated?${body}`, { headers: httpHeaders });
  }

  getAllDataHistoryReport(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/historyReport?${body}`, { headers: httpHeaders });
  }

  getAllDataTraceabilityReport(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/traceabilityReport?${body}`, { headers: httpHeaders });
  }

  getAllDataPaginatedReport(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/paginatedReport?${body}`, { headers: httpHeaders });
  }

  getAllDataPaginatedByLike(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/paginatedByLike?${body}`, { headers: httpHeaders });
  }

  getAllDataPaginatedBySaleItemsCompra(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/paginatedByCompra?${body}`, { headers: httpHeaders });
  }

  getAllDataPaginatedBySaleItemsRecibo(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/paginatedByRecibo?${body}`, { headers: httpHeaders });
  }

  getOneById(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/getone?${body}`, { headers: httpHeaders });
  }

  getOneByColumn(token: string, module: string, field: string, value: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/oneByColumn?${field}=${value}`, { headers: httpHeaders });
  }

  getAllDataFiltered(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/filtered?${body}`, { headers: httpHeaders });
  }

  getAllDataFilteredByRange(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/filteredByRange?${body}`, { headers: httpHeaders });
  }

  getListByColumn(token: string, module: string, field: string, value: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/listByColumn?${field}=${value}`, { headers: httpHeaders });
  }

  getListByLike(token: string, module: string, field: string, value: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/listByLike?${field}=${value}`, { headers: httpHeaders });
  }

  getPreByLike(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/preByLike?${body}`, { headers: httpHeaders });
  }

  getCountDataFiltered(token: string, module: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/countfiltered?${body}`, { headers: httpHeaders });
  }

  getConvertImageToBase64(token: string, body: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/convertImageToBase64?${body}`, { headers: httpHeaders });
  }

  getCountsByItem(token: string, module: string, field: string, value: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/countsByItem?${field}=${value}`, { headers: httpHeaders });
  }

  getRecentsByItem(token: string, module: string, field: string, value: string): Observable<IResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<IResponse>(`${this.API_URL}/${module}/recentsByItem?${field}=${value}`, { headers: httpHeaders });
  }

  storeItem(token: string, module: string, body: {}): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<IResponse>(`${this.API_URL}/${module}`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  postItem(token: string, module: string, body: {}): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<IResponse>(`${this.API_URL}/${module}`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  putItem(token: string, module: string, body: {}): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<IResponse>(`${this.API_URL}/${module}`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  patchItem(token: string, module: string, body: {}): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch<IResponse>(`${this.API_URL}/${module}`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  deleteItem(token: string, module: string, id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = {
      headers: httpHeaders,
      body: { id: id },
    };
    return this.http.delete<IResponse>(`${this.API_URL}/${module}`, options)
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  uploadFile(token: string, body: FormData): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<IResponse>(`${this.API_URL}/uploadFile`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  sendEmailWithPDF(token: string, body: FormData): Observable<any> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<IResponse>(`${this.API_URL}/sendEmailWithPDF`, body, { headers: httpHeaders })
      .pipe(
        map((resp: IResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }
}
