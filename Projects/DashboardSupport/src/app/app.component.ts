import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lang: string;
  constructor(private translate: TranslateService) {
    this.lang = localStorage.getItem("lang");
    if (this.lang) {
      this.translate.use(this.lang);
    } else {
      translate.setDefaultLang('en');
    }
  }

}
