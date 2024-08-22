import { AuthService } from 'src/app/service/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    return this.isUserAuthenticated();
  }

  private isUserAuthenticated(): boolean {
    if (!this.authService.user$) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
