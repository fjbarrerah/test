import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { SimuladorService } from '../servicio/simulador.service';
import { exists } from 'fs';
import { LoginService } from '../servicio/login.service';
import { ShareddataService } from '../servicio/shareddata.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  isExist: boolean = false;
  zendeskUser: any;
  items: any[] = [];
  level: { [key: string]: boolean } = {
    user: true,
    agent: false,
    admin: false,
  };
  user: any;
  isauth:boolean;

  constructor(private angularAuth: AngularFireAuth,
    private nzone: NgZone,
    private db: AngularFireDatabase,
    private simu: SimuladorService,
    private log: LoginService,
    private shared: ShareddataService
  ) { }

  ngOnInit() {

    this.isauth = this.log.setAuth();
    if(this.isauth){
      if(this.simu.getUserLevel()){
        this.level = this.simu.getUserLevel();
      }
    }

  }
  login() {
    Observable.fromPromise(
      this.angularAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    ).subscribe(res => {
      this.nzone.run(() => {
       this.log.getAuth(true);
       this.isauth = this.log.setAuth();
        this.angularAuth.authState.subscribe(res => {
          this.user = res;
          this.checkEmail();
        })
      })
    })
  }
  logout() {
    this.angularAuth.auth.signOut();
    this.log.getAuth(false);
    this.isauth = this.log.setAuth();
  }
  checkEmail() {
    if (!this.user) return;
      this.checkdatabaselevel();

  }
  checkdatabaselevel() {
    this.db.list('rol').valueChanges().subscribe(res => {
      this.items = res;
      for(let x=0;x<this.items.length;x++){
        if(this.items[x].email=== this.user.email){
          this.isExist = true;
          this.simu.sendOrgId(this.items[x].organization);

        }
      }
      if (!this.isExist) {
        this.checkAndSetLevel()
      }
        this.items = res;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].email === this.user.email) {
            if (this.items[i].rol === "admin") {
              this.level.user = true;
              this.level.agent = true;
              this.level.admin = true;
            } else if (this.items[i].rol === "agent") {
              this.level.user = true;
              this.level.agent = true;
              this.level.admin = false;
            }
          }
        }

      this.isExist = false;
      this.simu.setUserLevel(this.level);
      this.simu.setEmail(this.user.email);
    });
  }
  checkAndSetLevel() {
    this.simu.getZendeskUser().subscribe(res => {
      this.zendeskUser = res;
      console.log(res)
      //se recorre el array y si no existe en la base de datos de firebase se hace el push
      for (let x = 0; x < this.items.length; x++) {
        if (this.user.email === this.items[x].email) {
        } else {
          if (this.user.email === this.zendeskUser.users[x].email) {
            this.db.list('rol').push({ email: this.user.email, rol: this.zendeskUser.users[x].role, organization: this.zendeskUser.users[x].organization_id })
            break;
          }
        }
      }
    })
  }


}
