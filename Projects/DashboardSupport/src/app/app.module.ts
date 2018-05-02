import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { LoginService } from './servicio/login.service';
import { JsonpModule, Jsonp, Response } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SimuladorService } from './servicio/simulador.service';
import { MonthlyComponent } from './tickets/monthly/monthly.component';
import { TestComponent } from './test/test.component';
import { StadisticsComponent } from './tickets/monthly/stadistics/stadistics.component';
import { ShareddataService } from './servicio/shareddata.service';
import { GuardService } from './servicio/guard.service';
import { CallinfoComponent } from './tickets/monthly/callinfo/callinfo.component';
import { HourformatPipe } from './pipes/hourformat.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { YearsComponent } from './tickets/years/years.component';
import { AnualchartComponent } from './tickets/years/anualchart/anualchart.component';
import { CallchartComponent } from './tickets/monthly/callchart/callchart.component';
import { AnsComponent } from './ans/ans.component';
import { DayformatPipe } from './pipes/dayshour.pipe';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { UsersComponent } from './users/users.component';
import { OrganizationComponent } from './test/organization/organization.component';
import { EditComponent } from './test/edit/edit.component';
import { FormsModule } from '@angular/forms';
import { AnsStadisticsComponent } from './ans/ans-stadistics/ans-stadistics.component';
import { TotalComponent } from './ans/total/total.component';
import { SatisfaccionComponent } from './satisfaccion/satisfaccion.component';
import { OrgticketsComponent } from './organization/orgtickets/orgtickets.component';
import { OrgidComponent } from './organization/orgid/orgid.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WebComponent } from './tickets/monthly/web/web.component';
import { WebdetailsComponent } from './tickets/monthly/webdetails/webdetails.component';
import { TicketsfilterComponent } from './tickets/monthly/ticketsfilter/ticketsfilter.component';
import { YearsfilterComponent } from './tickets/years/yearsfilter/yearsfilter.component';
import { FakesatisfaccionService } from './servicio/fakesatisfaccion.service';
import { AnsDetailComponent } from './ans-detail/ans-detail.component';
import { AnsDetail2Component } from './ans/ans-detail2/ans-detail2.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TestComponent },
  //  { path: 'login', component: LoginComponent },
  { path: 'ticketsmonth', component: MonthlyComponent, canActivate: [GuardService] },
  { path: 'stadistic', component: StadisticsComponent, canActivate: [GuardService] },
  { path: 'ticketsphone', component: CallinfoComponent, canActivate: [GuardService] },
  { path: 'ticketsweb', component: WebComponent, canActivate: [GuardService] },
  { path: 'ticketsyear', component: YearsComponent, canActivate: [GuardService] },
  { path: 'chartyear', component: AnualchartComponent, canActivate: [GuardService] },
  { path: 'chartcall', component: CallchartComponent, canActivate: [GuardService] },
  { path: 'anspage', component: AnsComponent, canActivate: [GuardService] },
  { path: 'organization', component: OrganizationComponent, canActivate: [GuardService] },
  { path: 'edit', component: EditComponent, canActivate: [GuardService] },
  { path: 'ansStadistic', component: AnsStadisticsComponent, canActivate: [GuardService] },
  { path: 'ansTotal', component: TotalComponent, canActivate: [GuardService] },
  { path: 'sactisfaccion', component: SatisfaccionComponent, canActivate: [GuardService] },
  { path: 'orgtick', component: OrgticketsComponent, canActivate: [GuardService] },
  { path: 'orgid', component: OrgidComponent, canActivate: [GuardService] },
  { path: 'webdetails', component: WebdetailsComponent, canActivate: [GuardService] },
  { path: 'ticketsfilter', component: TicketsfilterComponent, canActivate: [GuardService] },
  { path: 'yeartotal', component: YearsfilterComponent, canActivate: [GuardService] },
  { path: 'ansdetail', component: AnsDetailComponent, canActivate: [GuardService] },
  { path: 'ansdetail2', component: AnsDetail2Component, canActivate: [GuardService] }


];
@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    MonthlyComponent,
    TestComponent,
    StadisticsComponent,
    CallinfoComponent,
    HourformatPipe,
    YearsComponent,
    KeysPipe,
    AnualchartComponent,
    CallchartComponent,
    AnsComponent,
    DayformatPipe,
    UsersComponent,
    OrganizationComponent,
    EditComponent,
    AnsStadisticsComponent,
    TotalComponent,
    SatisfaccionComponent,
    OrgticketsComponent,
    OrgidComponent,
    WebComponent,
    WebdetailsComponent,
    TicketsfilterComponent,
    YearsfilterComponent,
    AnsDetailComponent,
    AnsDetail2Component,




  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    Ng2GoogleChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    LoginService,
    SimuladorService,
    ShareddataService,
    GuardService,
    FakesatisfaccionService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
