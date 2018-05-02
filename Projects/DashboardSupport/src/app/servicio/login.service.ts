import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class LoginService {

  auth:boolean;
  tok: string = '8f7e5b354bba8d211cf2877799d0750536719bc1301843af55acc22a791c9f73';
  token: any[];
  url: string = '/api/tickets.json';
  redirectUrl = 'http%3A%2F%2Flocalhost%3A4200';
  clientId = 'emergya_api_zendesk';
  clientSecret: string = "abf332b69077bab9883df0ab9786b154dbc9e9a25254a630ab721dd192dc64ff";
  email: string = "fjbarrera@emergya.com";

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute) { }

  search() {
    let window;
    window.location = 'https://emergya7735.zendesk.com/oauth/authorizations/new?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A4200&client_id=emergya_api_zendesk&scope=read%20write';

    return this.http.get(this.url, {
      headers: {
        'withCredentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        'Authorization': 'Bearer' + this.tok,
        'Connection': 'Keep-Alive',
        'Content-Length': '0',
        'Content-Type:text/html': 'charset=utf-8'
      },
      responseType: 'json'
    }).subscribe(res => {

    });
  }
  decodeUrl() {
    this.activatedRoute.fragment.subscribe(res => {
      let params: any = {};
      if (res && res.length > 0) {
        const values = res.split('&');
        for (let i = 0; i < values.length; i++) {
          const data = values[i].split('=');
          params[data[0]] = data[1];
        }
      }
      if (params.access_token) {
        this.token = params;
      }
    });
  }
  setToken() {
    return this.token;
  }
getAuth(auth:boolean){
  this.auth=auth;
}
  setAuth(){
    return this.auth;
  }
}
