import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { environment } from '../../environments/environment';

@Injectable()
export class SimuladorService {
  orgid: number;
  userMail: String;
  level: any;
  workers: any[];
  tok = '8f7e5b354bba8d211cf2877799d0750536719bc1301843af55acc22a791c9f73';

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {

    });
  }
  public getJSON(): Observable<any> {

    return Observable.forkJoin([
      this.http.get("/api/v2/tickets.json", {
        headers: { 'Authorization': 'Bearer ' + this.tok, },
        responseType: 'json'
      }),
      this.http.get("/api/v2/ticket_audits.json", {
        headers: { 'Authorization': 'Bearer ' + this.tok },
        responseType: 'json'
      })
    ]).map((res: any) => {
      let tickets = res[0] && res[0].tickets ? res[0].tickets : [];
      let audits = res[1] && res[1].audits ? res[1].audits : [];
      let output = {};

      for (let i = 0; i < tickets.length; i++) {
        output[tickets[i].id] = tickets[i];
      }

      for (let i = 0; i < audits.length; i++) {
        const audit = audits[i];
        const target = output[audit.ticket_id];
        if (target) {
          if (target['audits']) {
            target['audits'].push(audit);
          } else {
            target['audits'] = [audit];
          }
        }
      }
      return Object.keys(output).map(function (key) { return output[key]; });;
    });
  }

  public getANS(): Observable<any> {

    return this.http.get("/api/v2/users.json", {
      headers: { 'Authorization': 'Bearer ' + this.tok, },
      responseType: 'json'
    }).map((users: any) => {
      const workers = [];
      for (let x = 0; x < users.length; x++) {
        if (users[x].organization_id === environment.organizationId) {
          workers.push(users[x].id);
        }
      }
      return workers;
    })
  }

  setWorker() {

    return this.workers;

  }
  getZendeskUser(){
    return this.http.get("/api/v2/users.json", {
      headers: { 'Authorization': 'Bearer ' + this.tok, },
      responseType: 'json'
    })
  }
  setUserLevel(level){
    this.level = level;

  }
  getUserLevel(){
    return this.level;
  }
  setEmail(userMail: String){
    this.userMail = userMail
  }
  getEmail(){
    return this.userMail;
  }
  getOrg(){
    return this.http.get("/api/v2/organizations.json", {
      headers: { 'Authorization': 'Bearer ' + this.tok, },
      responseType: 'json'
    })
  }
  getSatisfacc(){
    return this.http.get("/api/v2/satisfaction_ratings.json", {
      headers: { 'Authorization': 'Bearer ' + this.tok, },
      responseType: 'json'
    })
  }
  getOnlyTickets(){
    return this.http.get("/api/v2/tickets.json", {
      headers: { 'Authorization': 'Bearer ' + this.tok, },
      responseType: 'json'
    });
  }
  sendOrgId(res){
    this.orgid = res;
  }
  getOrgId(){
    return this.orgid;
  }
}
