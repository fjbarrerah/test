import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../servicio/shareddata.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { SimuladorService } from '../../servicio/simulador.service';
import { Observable } from 'rxjs/Observable';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css']
})
export class TotalComponent implements OnInit {


  timeLost: any[] = [];
  failTickets: any[] = [];
  worker: any[];
  data: { [key: string]: { mes: string; total: number; firstcontact: number; ressoltime: number; elements: any[]; }; };


  constructor(private simu: SimuladorService,
    private shared: ShareddataService,
    private db: AngularFireDatabase) { }

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

    });
  }

  getTotal(): void {
    for (const key of Object.keys(this.data)) {
      this.data[key].total = this.data[key].elements.length;
    }
  }

  getFirstContact() {
    this.db.list('organization').valueChanges().subscribe(res => {
      const fireData: any = res;
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
              if (
                comments[j].author_id === ticket.assignee_id
              ) {
                let timeresplost: number = 0;
                const dateComment = new Date(comments[j].created_at);
                const daterTicket = new Date(ticket.created_at);
                const timeDone = ((dateComment.getTime() - daterTicket.getTime()) / 1000);

                for (let t = 0; t < fireData.length; t++) {

                  if (ticket.organization_id === parseInt(fireData[t].id_organization)) {
                    if (timeDone <= fireData[t].time) {
                      row.firstcontact++;
                      this.data[key].ressoltime = ((this.data[key].ressoltime + timeDone) / row.firstcontact);
                      break;
                    }

                  }
                  break;
                }
                this.timeLost.push({ mes: this.data[key].mes, timelost: timeDone + timeresplost })
              }
            }
          }
        }
      }
      this.getDataFail();

    });
  }

  getDataFail() {
    for (const key of Object.keys(this.data)) {
      let timeLostTotal: number = 0;
      for (let i = 0; i < this.timeLost.length; i++) {
        if (this.data[key].mes === this.timeLost[i].mes) {
          timeLostTotal = timeLostTotal + this.timeLost[i].timelost;
        }
      }
      const failcontact = Math.ceil(this.data[key].total - this.data[key].firstcontact);
      this.failTickets.push({ mes: this.data[key].mes, total: this.data[key].total, firstcontact: failcontact, ressoltime: timeLostTotal })


    }
  }
}
