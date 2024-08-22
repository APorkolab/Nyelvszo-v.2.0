import { Component, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { AuthService } from 'src/app/service/auth.service';
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

  constructor(private auth: AuthService, private icon: IconModule) { }

  ngOnInit(): void {
    this.auth.logout();
  }

  onLogin(): void {
    this.auth.login(this.loginData);
  }
}