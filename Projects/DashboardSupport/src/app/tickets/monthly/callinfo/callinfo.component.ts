import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../../servicio/simulador.service';
import { ShareddataService } from '../../../servicio/shareddata.service';

@Component({
  selector: 'app-callinfo',
  templateUrl: './callinfo.component.html',
  styleUrls: ['./callinfo.component.css']
})
export class CallinfoComponent implements OnInit {

  call: any[];
  lost: number;
  acepted: number;
  recieve: number;
  totalTickets: any[];
  calltime: number;
  ticketsPhone: any[];
  ticketsjson: any;
  monthGroup: string;

  constructor(private simu: SimuladorService,
    private shared: ShareddataService) { }

  ngOnInit() {
    this.getTickets();
    this.monthGroup = this.shared.setButtomPressed();
    if (!this.monthGroup) {
      window.location.assign('/ticketsmonth');
    }

  }
  //recibimos todos los tickets para empezar a filtrarlos
  getTickets() {

    this.ticketsPhone = [];
    this.simu.getJSON().subscribe(res => {
      this.ticketsjson = res;
      this.callfilter();

    });
  }

  //colocando totaltime al objeto json
  callfilter() {

    const voiceTickets = this.ticketsjson.filter(t => {
      for (let i = 0; i < t.audits.length; i++) {
        if (t.audits[i].via.channel === 'voice') {

          return true;
        }
      }
      return false;
    });

    for (let i = 0; i < voiceTickets.length; i++) {
      if (!voiceTickets[i]['totalTime']) {
        voiceTickets[i]['totalTime'] = 0;
      }

      for (let j = 0; j < voiceTickets[i].audits.length; j++) {
        const audit = voiceTickets[i].audits[j];
        if (audit.via.channel === 'voice') {
          const totalAudit = audit.events.reduce((a, b) => {
            if (b.data && b.data.call_duration) {
              return b.data.call_duration + a;
            }
          }, 0);
          voiceTickets[i]['totalTime'] += totalAudit || 0;
        }
      }
    }


    this.monthFilter()
  }

  monthFilter() {
    this.recieve = 0;
    this.calltime = 0;
    this.totalTickets = [];
    for (let x = 0; x < this.ticketsjson.length; x++) {

      if (this.monthGroup === this.ticketsjson[x].created_at.substring(0, 7))
        if (this.ticketsjson[x].totalTime) {
          this.calltime = this.calltime + this.ticketsjson[x].totalTime;
          this.recieve++;
        }

    }
    this.callStatus();


    this.totalTickets.push({ mes: this.monthGroup, calltime: this.calltime, recieved: this.recieve, acepted: this.acepted, lost: this.lost });

  }

  callStatus() {
    this.acepted = 0;
    this.lost = 0;
    for (let x = 0; x < this.ticketsjson.length; x++) {
      if (this.ticketsjson[x].created_at.substring(0, 7) === this.monthGroup) {
        if (this.ticketsjson[x].status === "open" && this.ticketsjson[x].via.channel == "voice") {
          this.acepted++;
        } else if (this.ticketsjson[x].status === "new") {
          this.lost++;
        }
      }

    }

  }

  sendcall() {
    this.call = []
    this.call.push({ recieve: this.totalTickets[0].recieved, lost: this.totalTickets[0].lost });

    this.shared.getCallRecieved(this.call);

  }
}
