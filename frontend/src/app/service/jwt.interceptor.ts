import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

    return this.authService.access_token$.pipe(
      take(1),
      switchMap(accessToken => {
        if (this.isTokenExpired(accessToken)) {
          return this.refreshToken().pipe(
            switchMap((newToken: string) => {
              const authReq = request.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next.handle(authReq);
            }),
            catchError((err) => this.handleAuthError(err))
          );
        } else {
          const authReq = request.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          });
          return next.handle(authReq);
        }
      }),
      catchError((err) => this.handleAuthError(err))
    );
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  private refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable().pipe(
        filter(token => token != null),
        take(1)
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((newToken: string) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(newToken);
        this.authService.access_token$.next(newToken); // Frissítjük a token-t az authService-ben
        return from([newToken]);
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.authService.logout(); // Kilépünk a felhasználóból
        return throwError(() => new Error('Unable to refresh token. Please log in again.'));
      })
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.authService.logout();
    } else {
      console.error('HTTP Error:', error); // További naplózás
    }
    return throwError(() => new Error(error.message));
  }
}