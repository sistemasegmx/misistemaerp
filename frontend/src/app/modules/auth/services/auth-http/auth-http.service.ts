import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthModel, AuthResponse, FormatResponse } from '../../models/auth.model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.baseUrl}`;

@Injectable({ providedIn: 'root', })

export class AuthHTTPService {

  constructor(private http: HttpClient) { }

  getOneById(token: string, module: string, id: string): Observable<FormatResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<FormatResponse>(`${API_URL}/${module}/getone?id=${id}`, { headers: httpHeaders, });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password, })
      .pipe(
        map((resp: AuthResponse) => {
          const auth = new AuthModel();
          if (resp.status === 200) {
            auth.access_token = resp.data.access_token;
            auth.refresh_token = resp.data.refresh_token;
            auth.expires_at = resp.data.expires_at;
            auth.expiresIn = new Date(resp.data.expires_at * 1000).toISOString();
          }
          return auth;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  registration(fullname: string, email: string, password: string): Observable<any> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, { fullname, email, password, })
      .pipe(
        map((resp: FormatResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<FormatResponse>(`${API_URL}/auth/forgot`, { email })
      .pipe(
        map((resp: FormatResponse) => { return resp; }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }

  getUserByToken(token: string): Observable<AuthResponse> {
    const httpHeaders = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<AuthResponse>(`${API_URL}/user/bytoken`, { headers: httpHeaders, });
  }
}
