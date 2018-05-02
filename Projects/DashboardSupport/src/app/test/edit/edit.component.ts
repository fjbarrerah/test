import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../servicio/simulador.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  errorVisible: boolean = false;
  dbtime: number;
  selectionOrg: any;
  options: any;
  visible: boolean = false;
  constructor(private simu: SimuladorService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.simu.getOrg().subscribe((res: any) => {
      this.options = res.organizations;
    })
  }
  updateAns() {
    this.errorVisible = false;
    this.visible = false;
    //si algun valor esta null no lo dejamos hacer nada de la web
    if (this.selectionOrg.select != null && this.selectionOrg.time && this.selectionOrg.slatype != null && this.selectionOrg.timeMetter != null) {
      this.formatTime();
      //comprueba si existe en la base de datos de firebase, si no lo hace lo genera, si existe en la base de datos lo actualiza
      let nobucle: boolean = false;
      this.db.list('organization').valueChanges().subscribe(res => {
        let firebaselog: any = res;
        let inDataBase: boolean = false;

        //comprobacion si el registro existe en la base de datos o no, y evitamos el bucle infinito generado por el VALUECHANGES();
        if (!nobucle) {
          for (let i = 0; i < firebaselog.length; i++) {
            if (this.selectionOrg.select === firebaselog[i].id_organization) {
              inDataBase = true;
              if (this.selectionOrg.slatype === "firstcontact") {
                this.db.list('organization').update(firebaselog[i].key, { id_organization: this.selectionOrg.select, time: this.dbtime, firstdiag:firebaselog[i].firstdiag, resoltime: firebaselog[i].resoltime })
              } else if (this.selectionOrg.slatype === "firstdiag") {
                this.db.list('organization').update(firebaselog[i].key, { id_organization: this.selectionOrg.select,time:firebaselog[i].time, firstdiag: this.dbtime, resoltime: firebaselog[i].resoltime })
              } else if (this.selectionOrg.slatype === "soltime") {
                this.db.list('organization').update(firebaselog[i].key, { id_organization: this.selectionOrg.select,time: firebaselog[i].time ,firstdiag:firebaselog[i].firstdiag, resoltime: this.dbtime })
              }

              this.visible = true;
              nobucle = true;
              break
            }
          }
          if (!inDataBase) {
            //se crea un pushid y se guarda en una constante, despues se genera un set con la key anteriormente generada
            const pushId = this.db.createPushId();
            let item;
            if (this.selectionOrg.slatype === "firstcontact") {
              item = { key: pushId, id_organization: this.selectionOrg.select, time: this.dbtime, firstdiag: 0, resoltime: 0 };
            } else if (this.selectionOrg.slatype === "firstdiag") {
              item = { key: pushId, id_organization: this.selectionOrg.select, time: 0, firstdiag: this.dbtime, resoltime: 0 };
            } else if (this.selectionOrg.slatype === "soltime") {
              item = { key: pushId, id_organization: this.selectionOrg.select, time: 0, firstdiag: 0, resoltime: this.dbtime };
            }
            this.db.list('organization').set(item.key, item);
            nobucle = true;
            this.visible = true;
          }
        }
      })
    } else {
      //si falta algun dato hacemos visible el div modal con un mensaje de error
      this.errorVisible = true;
    }
  }
  capture(select: object) {
    this.selectionOrg = select;
    this.updateAns();
  }

  formatTime() {
    //se formatea la hora a minutos
    if (this.selectionOrg.timeMetter === 'day') {
      this.dbtime = Math.ceil((this.selectionOrg.time) * 60) * 24;
    } else if (this.selectionOrg.timeMetter === 'hour') {
      this.dbtime = Math.ceil(this.selectionOrg.time) * 60;
    } else {
      this.dbtime = this.selectionOrg.time;
    }
  }
  setVisible() {
    this.visible = false;
  }
  setErrorVisible() {
    this.errorVisible = false;
  }
}
