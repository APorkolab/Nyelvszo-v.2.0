import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let accessToken = this.authService.access_token$.getValue();

    if (this.isTokenExpired(accessToken)) {
      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          accessToken = newToken;
          const authReq = request.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          });
          return next.handle(authReq);
        }),
        catchError((err) => this.handleAuthError(err))
      );
    }

    const authReq = accessToken
      ? request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
      : request;

    return next.handle(authReq).pipe(
      catchError((err) => this.handleAuthError(err))
    );
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.authService.logout();
    }
    return throwError(() => new Error(error.message));
  }
}