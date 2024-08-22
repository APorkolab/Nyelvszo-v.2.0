import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data['expectedRole'] as number | null;

    if (expectedRole === null || expectedRole === undefined) {
      return of(true);
    }

    return this.authService.user$.pipe(
      map(user => {
        const userRole = user?.role ?? 1;

        if (userRole < expectedRole) {
          this.router.navigate(['forbidden']);
          return false;
        }
        return true;
      })
    );
  }
}