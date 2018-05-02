import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../servicio/simulador.service';
import { Observable } from 'rxjs/Observable';
import { ShareddataService } from '../servicio/shareddata.service';

@Component({
  selector: 'app-ans',
  templateUrl: './ans.component.html',
  styleUrls: ['./ans.component.css']
})
export class AnsComponent implements OnInit {

  ticksum: any[];
  auditsId: any[] = [];
  worker: any[];
  data: { [key: string]: { mes: string; total: number; firstcontact: number; ressoltime: number; elements: any[]; }; };

  constructor(private simu: SimuladorService,
    private shared: ShareddataService) { }

  ngOnInit() {
    //recogemos los tickets
    Observable.forkJoin(
      this.simu.getJSON(),
      this.simu.getANS(),
    ).subscribe(res => {

      const values = res[0];
      this.worker = res[1];

      let data: {
        [key: string]: {
          mes: string;
          total: number;
          firstcontact: number;
          ressoltime: number;
          elements: any[];
        }
      } = {};

      for (let i = 0; i < values.length; i++) {
        const mesAct = values[i].created_at.substring(0, 7);

        if (!data[mesAct]) {
          data[mesAct] = {
            mes: mesAct,
            total: 0,
            firstcontact: 0,
            ressoltime: 0,
            elements: [],
          };
        };
        data[mesAct].elements.push(values[i]);
      }
      this.data = data;
      this.getTotal();
      this.getFirstContact();
      this.resTime();
      this.totalAns();
      this.sendData();
    });
  }

  getTotal(): void {
    for (const key of Object.keys(this.data)) {
      this.data[key].total = this.data[key].elements.length;
    }
  }

  getFirstContact() {
    for (const key of Object.keys(this.data)) {
      const row = this.data[key];
      row.firstcontact = 0;
      for (let i = 0; i < row.elements.length; i++) {
        const ticket = row.elements[i];
        const comments = ticket.audits.filter(audit => {
          for (let j = 0; j < audit.events.length; j++) {
            if (audit.events[j].type === 'Comment') {
              audit['comment'] = audit.events[j];
              return true;
            }
          }
        });
        ticket['comments'] = comments;

        if (comments.length >= 2) {
          for (let j = comments.length - 2; j >= 0; j--) {
            if (comments[j].author_id === ticket.assignee_id) {
              this.auditsId.push({ ticketid: comments[j].ticket_id, created: comments[j].created_at, key: this.data[key].mes })
              this.shared.getAudId(this.auditsId)
              row.firstcontact++;
              break;
            }
          }
        }
      }
    }
  }
  resTime() {
    for (const key of Object.keys(this.data)) {
      for (let i = 0; i < this.data[key].elements.length; i++) {
        if (this.data[key].elements[i].status === "solved") {
          const fecha1 = new Date(this.data[key].elements[i].created_at);
          const fecha2 = new Date(this.data[key].elements[i].updated_at);
          this.data[key].ressoltime = this.data[key].ressoltime + ((fecha2.getTime() - fecha1.getTime()) / 1000);
        }
      }
      this.data[key].ressoltime = this.data[key].ressoltime / this.data[key].elements.length;
    }
    return this.data;
  }

  ansKey(monthActual: string) {
    this.shared.getAnsMonth(monthActual);
  }

  totalAns() {
    this.ticksum = [];
    let total = 0;
    let firstcontactans = 0;
    let timeAverage = 0;

    for (const key of Object.keys(this.data)) {
      total = total + this.data[key].total;
      firstcontactans = firstcontactans + this.data[key].firstcontact;
      timeAverage = timeAverage + this.data[key].ressoltime;
    }
    this.ticksum.push({ total: total, firstcontact: firstcontactans, average: timeAverage });
  }
  sendData() {
    this.shared.totalData(this.data);
  }

}



