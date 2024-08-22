import { User } from './../model/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IAuthModel {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface ILoginData {
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/login`;

  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  access_token$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.initializeUserFromSession();
    this.handleUserSubscription();
  }

  private initializeUserFromSession(): void {
    const loginInfo = sessionStorage.getItem('login');
    if (loginInfo) {
      const loginObject: IAuthModel = JSON.parse(loginInfo);
      this.access_token$.next(loginObject.accessToken);
      this.user$.next(loginObject.user);
    }
  }

  private handleUserSubscription(): void {
    this.user$.subscribe({
      next: (user) => {
        user ? this.router.navigate(['/']) : this.clearSession();
      },
    });
  }

  private clearSession(): void {
    this.access_token$.next('');
    sessionStorage.removeItem('login');
  }

  login(loginData: ILoginData): void {
    this.http.post<IAuthModel>(this.loginUrl, loginData).subscribe({
      next: (response: IAuthModel) => {
        this.user$.next(response.user);
        this.access_token$.next(response.accessToken);
        sessionStorage.setItem('login', JSON.stringify(response));
      },
      error: (err) => this.handleLoginError(err),
    });
  }

  private handleLoginError(error: any): void {
    console.error('Login failed', error);
    // Lehetőség van a hibák részletes kezelésére, például értesítések megjelenítésére
  }

  logout(): void {
    this.clearSession();
    this.user$.next(null);
  }
}
