import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../servicio/login.service';
import { SimuladorService } from '../../servicio/simulador.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  answerTime: any[] = [];
  zendeskOrg: any;
  organizationid: any;
  organizations: any;
  userMail: String;
  level: any;
  zendeskUser: any;
  constructor(private login: LoginService,
    private simu: SimuladorService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.orgFilter();

  }

  orgFilter() {
    this.level = this.simu.getUserLevel();
    this.userMail = this.simu.getEmail();
    this.simu.getZendeskUser().subscribe(res => {
      this.zendeskUser = res;
      for (let i = 0; i < this.zendeskUser.users.length; i++) {
        if (this.userMail === this.zendeskUser.users[i].email) {
          //comprueba si existe en la base de datos
          this.db.list('rol').valueChanges().subscribe(res => {
            let fireBaseUser: any = res;
            for (let x = 0; x < fireBaseUser.length; x++) {
              if (this.userMail === fireBaseUser[x].email) {
                break
              }
              if (x === fireBaseUser.length - 1) {
                this.db.list('rol').push({ email: this.userMail, rol: this.zendeskUser.users[i].role })

              }
            }
          })
          //fin de la comprobacion
          this.organizationid = this.zendeskUser.users[i].organization_id;
          if (this.level.admin === false && this.level.agent === false && this.level.user === true) {
            this.checkOrganizations();
          } else {
            this.showAll();
          }
          break;
        } else if (!this.answerTime) {
          this.answerTime.push({ id: 404, name: "No esta asignado a ninguna organizacion", time: 0 })

        }
      }
    });

  }
  checkOrganizations() {
    this.simu.getOrg().subscribe(res => {
      this.zendeskOrg = res
      for (let x = 0; x < this.zendeskOrg.organizations.length; x++) {
        if (this.zendeskOrg.organizations[x].id === this.organizationid) {
          this.db.list('organization').valueChanges().subscribe(res => {
            this.organizations = res;
            for (let i = 0; i < this.organizations.length; i++) {
              if (this.organizationid === this.organizations[i].id_organization) {
                this.answerTime.push({ id: this.organizationid, name: this.zendeskOrg.organizations[x].name, time: this.organizations[i].stimated_time })

            }
            }
          });
        }
      }
    })
  }

  showAll() {
    this.db.list('organization').valueChanges().subscribe(result => {
      let resultado: any = result;

      this.simu.getOrg().subscribe(res => {
        this.zendeskOrg = res;
        for (let i = 0; i < this.zendeskOrg.organizations.length; i++) {
          for (let x = 0; x < resultado.length; x++) {
            if (this.zendeskOrg.organizations[i].id === parseInt(resultado[x].id_organization)) {
              this.answerTime.push({ id: this.zendeskOrg.organizations[i].id, name: this.zendeskOrg.organizations[i].name, time: resultado[x].time, firstdiag: resultado[x].firstdiag, resoltime: resultado[x].resoltime })
              break
            }

          }
        }
        const ids = resultado.map(item => item.id_organization)
        const zendid = this.zendeskOrg.organizations.map(zenditem => zenditem.id.toString())
        let merge = ids.concat(zendid)


        for (let i = 0; i < resultado.length; i++) {
          for (let x = 0; x < merge.length; x++) {
            if (resultado[i].id_organization === merge[x]) {
              delete(merge[merge.indexOf(resultado[i].id_organization)])
            }

          }
        }
        for(let x=0;x<merge.length;x++){
          if(merge[x]!=null){
            for(let t=0; t < this.zendeskOrg.organizations.length; t++){
              if(parseInt(merge[x]) === this.zendeskOrg.organizations[t].id){
                this.answerTime.push({ id: merge[x], name: this.zendeskOrg.organizations[t].name, time: 0 })
              }

            }

          }
        }

      })
    });
  }
}

