import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../servicio/simulador.service';
import { ShareddataService } from '../../servicio/shareddata.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-ans-stadistics',
  templateUrl: './ans-stadistics.component.html',
  styleUrls: ['./ans-stadistics.component.css']
})
export class AnsStadisticsComponent implements OnInit {
  ticketsUnSucced: any[]=[];
  ticketsSucced: any[]=[];
  resUnSucced: number=0;
  resSucced: number=0;
  ansUnfulfilled: any[]=[];
  totalTickets:number=0;
  ansFulfilled: any[] = [];
  monthActual: any;
  unSuccess: number = 0;
  success: number = 0;
  answerTime: any[] = [];
  audits: any;
  tickets: any;
  constructor(private simu: SimuladorService,
    private shared: ShareddataService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.simu.getJSON().subscribe(res => {
      this.tickets = res;
      this.audits = this.shared.setAudId();
      this.monthActual = this.shared.setAnsMonth();
      this.ansSucced()
    })
  }
  ansSucced() {
    for (let i = 0; i < this.audits.length; i++) {
      for (let x = 0; x < this.tickets.length; x++) {
        if (this.audits[i].ticketid === this.tickets[x].id) {
          const fecha1 = new Date(this.audits[i].created);
          const fecha2 = new Date(this.tickets[x].created_at);

          const fecha3 =new Date(this.tickets[x].updated_at);
          const fecha4 = (fecha3.getTime() - fecha2.getTime()) / 1000;

          this.answerTime.push({ ansSucced: ((fecha1.getTime() - fecha2.getTime()) / 1000), organization_id: this.tickets[x].organization_id, mes: this.tickets[x].created_at.substring(0,7), resoltime: fecha4, id: this.tickets[x].id, priority: this.tickets[x].priority, created_at: this.tickets[x].created_at, updated_at: this.tickets[x].updated_at });
          break;
        }
      }
    }

    this.fireBaseData()
  }

  fireBaseData() {

    this.db.list('organization').valueChanges().subscribe(res => {
      const orgTime: any = res;
      let timeAverage: number = 0;
      let timeUnfulfilled: number = 0;

      for (let i = 0; i < this.answerTime.length; i++) {
        for (let x = 0; x < orgTime.length; x++) {
          if (this.monthActual === this.answerTime[i].mes) {
            if (this.answerTime[i].organization_id === parseInt(orgTime[x].id_organization)) {

              if ((this.answerTime[i].ansSucced) / 60 <= parseInt(orgTime[x].time)) {
                this.success++;
                timeAverage = timeAverage + this.answerTime[i].ansSucced;

                this.ticketsSucced.push({ticket_id: this.answerTime[i].id,  priority: this.answerTime[i].priority, created: this.answerTime[i].created_at, updated: this.answerTime[i].updated_at, organization: this.answerTime[i].organization_id})
              } else {
                this.unSuccess++;
                timeUnfulfilled = timeUnfulfilled + this.answerTime[i].ansSucced;

                this.ticketsUnSucced.push({ticket_id: this.answerTime[i].id,  priority: this.answerTime[i].priority, created: this.answerTime[i].created_at, updated: this.answerTime[i].updated_at, organization: this.answerTime[i].organization_id})

              }
            }

           if(this.answerTime[i].resoltime <= parseInt(orgTime[x].resoltime)){
            this.resSucced++
            }else {
              this.resUnSucced++

            }
          }
        }
      }
      this.totalMonth()
      this.ansFulfilled.push({ month: this.monthActual, total:this.totalTickets, firstcontact: this.success, average: ((timeAverage)/this.success), restime: this.resSucced});
      this.ansUnfulfilled.push({month: this.monthActual, total:this.totalTickets,firstcontact: this.unSuccess, average: ((timeUnfulfilled)/this.unSuccess), restime: this.resUnSucced})
      this.shared.getTicketsAnsSucc(this.ticketsSucced);
      this.shared.getTicketsAnsNoSucc(this.ticketsUnSucced);
      this.shared.getActualMonth(this.monthActual)

    })

  }

  totalMonth(){

    for(let i=0; i<this.tickets.length;i++){
      if(this.monthActual === this.tickets[i].created_at.substring(0,7)){
        this.totalTickets++;
      }
    }

  }
}
