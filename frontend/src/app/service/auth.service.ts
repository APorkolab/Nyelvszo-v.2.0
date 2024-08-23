import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
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
  access_token$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
    this.access_token$.next('');
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
      // Itt visszatérítünk egy observable-t, így a komponensek tudnak feliratkozni rá
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(this.refreshUrl, {}).pipe(
      tap((response) => {
        this.access_token$.next(response.accessToken);
        const currentUser = this.user$.getValue();
        if (currentUser) {
          sessionStorage.setItem(
            'login',
            JSON.stringify({ user: currentUser, accessToken: response.accessToken })
          );
        }
      }),
      map(response => response.accessToken)
    );
  }

  private handleLoginError(error: HttpErrorResponse): void {
    console.error('Login failed', error);
    this.notify.showError('Login failed: ' + error.message);
  }

  logout(): void {
    this.clearSession();
    this.notify.showSuccess('Logout has been completed');
  }
}
