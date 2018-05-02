import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../servicio/simulador.service';
import { Observable } from 'rxjs/Observable';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { tick } from '@angular/core/testing';
import { ShareddataService } from '../../servicio/shareddata.service';

@Component({
  selector: 'app-orgtickets',
  templateUrl: './orgtickets.component.html',
  styleUrls: ['./orgtickets.component.css']
})
export class OrgticketsComponent implements OnInit {

  userOrg: any[]=[];
  client: boolean= false;
  noclient: boolean= false;
  arrowsortLastUp: number;
  sortLastUp: boolean = true;
  arrowsortStatus: number;
  sortStatus: boolean = true;
  arrowsortCreate: number;
  sortCreate: boolean = true;
  arrowsortTicket: number;
  sortTicket: boolean = true;
  arrowSortName: number;
  sortName: boolean = true;
  ticketOrg: any[] = [];
  constructor(private simu: SimuladorService,
    private shared: ShareddataService) { }

  ngOnInit() {
    this.getTickets();
    this.role();


  }
  getTickets() {
    return Observable.forkJoin(
      this.simu.getOnlyTickets(),
      this.simu.getOrg()
    ).subscribe((res: any) => this.join(res[0].tickets, res[1].organizations))

  }
   join(ticket, org) {
    for (let i = 0; i < org.length; i++) {
      for (let x = 0; x < ticket.length; x++) {
        if (org[i].id === ticket[x].organization_id) {
          let priority
          if (ticket[x].priority) {
            priority = ticket[x].priority;
          } else {
            priority = "ninguna"
          }
          this.ticketOrg.push({ OrgId: org[i].id, Orgname: org[i].name, ticketId: ticket[x].id, creacion: new Date(ticket[x].created_at), status: ticket[x].status, lastupdate: new Date(ticket[x].updated_at), prioridad: priority })
        }
      }
    }
    this.shared.getOrgTickets(this.ticketOrg);
    this.clientTickets();
  }
  sortByName() {
    if (this.sortName) {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.Orgname > b.Orgname ? 1 : -1);
      this.arrowSortName = 1;
    } else {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.Orgname < b.Orgname ? 1 : -1);
      this.arrowSortName = 2;
    }
    this.sortName = !this.sortName;
  }
  sortByTicket() {
    if (this.sortTicket) {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.ticketId > b.ticketId ? 1 : -1);
      this.arrowsortTicket = 1;
    } else {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.ticketId < b.ticketId ? 1 : -1);
      this.arrowsortTicket = 2;
    }
    this.sortTicket = !this.sortTicket;
  }
  sortByCreate() {
    if (this.sortCreate) {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.creacion > b.creacion ? 1 : -1);
      this.arrowsortCreate = 1;
    } else {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.creacion < b.creacion ? 1 : -1);
      this.arrowsortCreate = 2;
    }
    this.sortCreate = !this.sortCreate;
  }
  sortByStatus() {
    if (this.sortStatus) {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.status > b.status ? 1 : -1);
      this.arrowsortStatus = 1;
    } else {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.status < b.status ? 1 : -1);
      this.arrowsortStatus = 2;
    }
    this.sortStatus = !this.sortStatus;
  }
  sortByLastUp() {
    if (this.sortLastUp) {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.lastupdate > b.lastupdate ? 1 : -1);
      this.arrowsortLastUp = 1;
    } else {
      this.ticketOrg = this.ticketOrg.sort((a, b) => a.lastupdate < b.lastupdate ? 1 : -1);
      this.arrowsortLastUp = 2;
    }
    this.sortLastUp = !this.sortLastUp;
  }
  exportCsv() {
    new Angular2Csv(this.ticketOrg, 'My Report');
  }

  role(){

    let role =this.simu.getUserLevel()
   if(role.agent || role.admin){
     this.noclient = true;
   }else{
    this.client = true;
   }
  }

  clientTickets(){
    const orgId = this.simu.getOrgId();
    const orgTickets = this.shared.setOrgTickets();

    for(let i=0; i<orgTickets.length; i++){
      if(orgId === orgTickets[i].OrgId){
        this.userOrg.push({ OrgId: orgTickets[i].OrgId, Orgname: orgTickets[i].Orgname, ticketId: orgTickets[i].ticketId, creacion: new Date(orgTickets[i].creacion), status: orgTickets[i].status, lastupdate: new Date(orgTickets[i].lastupdate), prioridad: orgTickets[i].prioridad})
      }
    }
  }
}
