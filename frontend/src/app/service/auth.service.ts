import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './../model/user';
import { NotificationService } from './notification.service';

export interface IAuthModel {
  success: boolean;
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/login`;
  private readonly refreshUrl = `${environment.apiUrl}/refresh-token`;

  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  access_token$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, private notify: NotificationService) {
    this.initializeUserFromSession();
  }

  private initializeUserFromSession(): void {
    const loginInfo = sessionStorage.getItem('login');
    if (loginInfo) {
      const loginObject: IAuthModel = JSON.parse(loginInfo);
      this.access_token$.next(loginObject.accessToken);
      this.user$.next(loginObject.user);
    }
  }

  private clearSession(): void {
    this.access_token$.next(null);
    this.user$.next(null);
    sessionStorage.removeItem('login');
    this.router.navigate(['login']);
  }

  login(loginData: { email?: string; password?: string }): Observable<IAuthModel> {
    return this.http.post<IAuthModel>(this.loginUrl, loginData).pipe(
      tap((response: IAuthModel) => {
        this.user$.next(response.user);
        this.access_token$.next(response.accessToken);
        sessionStorage.setItem('login', JSON.stringify(response));
      }),
      catchError(this.handleLoginError.bind(this))
    );
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable().pipe(
        switchMap(token => token ? from([token]) : throwError(() => new Error('No token available')))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http.post<{ accessToken: string }>(this.refreshUrl, {}).pipe(
      tap((response) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.accessToken);
        this.access_token$.next(response.accessToken);
        const currentUser = this.user$.getValue();
        if (currentUser) {
          sessionStorage.setItem(
            'login',
            JSON.stringify({ user: currentUser, accessToken: response.accessToken })
          );
        }
      }),
      map(response => response.accessToken),
      catchError((error) => {
        this.isRefreshing = false;
        this.handleAuthError(error);
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    console.error('Login failed', error);
    this.notify.showError('Login failed: ' + error.message);
    return throwError(() => new Error('Login failed'));
  }

  private handleAuthError(error: HttpErrorResponse): void {
    console.error('Auth error', error);
    if (error.status === 401) {
      this.clearSession();
    }
    this.notify.showError('Authentication error: ' + error.message);
  }

  logout(): void {
    this.clearSession();
    this.notify.showSuccess('Logout has been completed');
  }
}