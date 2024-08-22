import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService, IMenuItem } from './service/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebar: IMenuItem[] = [];
  title = 'NyelvSzo2.0';

  constructor(private config: ConfigService, public translate: TranslateService) {
    translate.addLangs(['hu', 'en']);
    translate.setDefaultLang('hu');
  }

  ngOnInit(): void {
    this.sidebar = this.config.sidebarMenu;
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }
}
