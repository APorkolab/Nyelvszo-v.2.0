import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'] as number;
    const userRole = this.authService.user$.value?.role ?? 1;

    if (userRole < expectedRole) {
      this.router.navigate(['forbidden']);
      return false;
    }
    return true;
  }
}