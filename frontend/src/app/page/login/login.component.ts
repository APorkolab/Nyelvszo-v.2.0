import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';  // Router importálása

export interface ILoginData {
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: ILoginData = {};

  constructor(
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router  // Router injektálása
  ) { }

  ngOnInit(): void {
    this.auth.logout();
  }

  onLogin(): void {
    this.auth.login(this.loginData).subscribe({
      next: () => {
        this.notify.showSuccess('Login successful!');
        this.router.navigate(['/users']);
      },
      error: (err: any) => {
        this.notify.showError('Login failed: ' + err.message);
      },
    });
  }
}