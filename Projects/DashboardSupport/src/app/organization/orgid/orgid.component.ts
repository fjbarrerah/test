import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../servicio/shareddata.service';
import { SimuladorService } from '../../servicio/simulador.service';

@Component({
  selector: 'app-orgid',
  templateUrl: './orgid.component.html',
  styleUrls: ['./orgid.component.css']
})
export class OrgidComponent implements OnInit {

  fillterDone: any[]=[];
  options: any;
  orgTickets: any;
  constructor(private shared:ShareddataService,
  private simu: SimuladorService) { }

  ngOnInit() {
    this.orgTickets = this.shared.setOrgTickets();
    this.organization();
  }
  organization(){
    this.simu.getOrg().subscribe((res:any) =>{
        this.options = res.organizations;
    })
  }
  fillter(id:string){
    this.fillterDone = [];
    for(let i=0; i< this.orgTickets.length; i++){
      if(id === this.orgTickets[i].OrgId.toString()){
        this.fillterDone.push({Orgname: this.orgTickets[i].Orgname, ticketId: this.orgTickets[i].ticketId, creacion: this.orgTickets[i].creacion, status: this.orgTickets[i].status, lastupdate: this.orgTickets[i].lastupdate, prioridad: this.orgTickets[i].prioridad })
      }
    }
  }
  csvExport(){
    new Angular2Csv(this.fillterDone, 'My Report');
  }
}
