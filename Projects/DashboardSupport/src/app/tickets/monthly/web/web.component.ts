import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../../servicio/shareddata.service';
import { SimuladorService } from '../../../servicio/simulador.service';

@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit {

  totalTicketsWeb: any[]=[];
  ticketsjson: any;
  monthSelect: string;
  constructor(private shared: ShareddataService,
    private simu: SimuladorService) { }

  ngOnInit() {
    this.monthSelect = this.shared.setButtomPressed();
    console.log(this.monthSelect)
    this.getTickets()
  }

  getTickets() {
    this.simu.getJSON().subscribe(res => {
      this.ticketsjson = res;
      console.log(this.ticketsjson)
      this.webFilter()
    });
  }

  webFilter() {
    let totalEmails:number =0;
    let totalMonth:number =0;

    const webTickets = this.ticketsjson.filter(t => {
      if(t.via.channel ==="web" || t.via.channel ==="email"){
          return true;
      }
      return false;
    });
    this.shared.getWebTickets(webTickets);

    for (let i = 0; i < webTickets.length; i ++){
      if(this.monthSelect === webTickets[i].created_at.substring(0, 7)){
        totalEmails ++;
        totalMonth ++;
      }
    }
    this.totalTicketsWeb.push({mes: this.monthSelect, total:  totalMonth, web_email: totalEmails})
  }
}
