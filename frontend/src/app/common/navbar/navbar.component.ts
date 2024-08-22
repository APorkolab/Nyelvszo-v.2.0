import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null> | undefined;
  rights = '';

  constructor(
    private authService: AuthService,
    public translate: TranslateService
  ) {
    this.initializeTranslation();
  }

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  private initializeTranslation(): void {
    this.translate.addLangs(['en', 'hu']);
    this.translate.setDefaultLang('hu');
  }

  rightsOfAdmin(role: number): string {
    switch (role) {
      case 1:
        return 'You may view all tables except users, but you may not create, edit or delete any entities.';
      case 2:
        return 'You may view all tables except users, and you may edit any of them but you may not create or delete any entities.';
      case 3:
        return 'You may view all tables, and you may create, edit or delete any entities.';
      default:
        return 'Invalid role value. The role value can only be 1, 2 or 3.';
    }
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }
}