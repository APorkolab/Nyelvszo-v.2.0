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
    // Kivételek hozzáadása a nyílt API-khoz és a fordítási kérésekhez
    const publicGetUrls = ['/entries'];
    const publicAllMethodsUrls = ['/login'];
    const translationUrls = ['/assets/i18n/'];

    // Ha a kérés GET az /entries végponthoz vagy bármilyen kérés a /login végponthoz, engedjük át
    if (
      (publicGetUrls.some(url => request.url.includes(url)) && request.method === 'GET') ||
      publicAllMethodsUrls.some(url => request.url.includes(url)) ||
      translationUrls.some(url => request.url.includes(url))
    ) {
      return next.handle(request);
    }

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