import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../servicio/simulador.service';
import { ShareddataService } from '../../servicio/shareddata.service';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit {

  ticksum: any[];
  statusopen: number = 0;
  cuentame: number;
  ticketsTotal: any[];
  cont: number;
  monthGroup: any[];
  monthYear: any[];
  ticketsjson: any;
  constructor(private simu: SimuladorService,
    private shared: ShareddataService) { }

  ngOnInit() {

    //---------------------------------------------------------------------------------------------------------------------------------------------
    //traemos la informacion de los tickets
    //---------------------------------------------------------------------------------------------------------------------------------------------
    this.simu.getJSON().subscribe(res => {
      this.ticketsjson = res;
      //separamos la hora de la fecha
      this.monthYear = [];
      for (let i = 0; i < this.ticketsjson.length; i++) {
        this.monthYear.push(this.ticketsjson[i].created_at.split("T", 1)[0]);
      }

      //separamos la fecha
      this.monthGroup = [];
      for (let x = 0; x < this.monthYear.length; x++) {
        this.monthGroup.push(this.monthYear[x].substring(0, 7));
      }

      //Agrupamos el array por fechas
      this.cont = 0;
      this.ticketsTotal = [];
      this.cuentame = 0;
      let status: number = 0;
      let statusrest: number = 0;

      for (let g = 0; g < this.monthGroup.length; g++) {

        //comparacion si existe un ticket en la posicion anterior para saber cuantos tickets hay con el mismo AÑO-MES
        if (this.cont > 0) {
          //comprobacion del status del ticket
          if (this.ticketsjson[g].status === "solved") {
            status++;
          } else if (this.ticketsjson[g].status === "pending") {
            statusrest++;
          }
          if (this.monthGroup[g] === this.monthGroup[g - 1]) {

            this.cuentame++;

          } else {

            this.reopen();
            //asignamos a un objeto los datos filtrados por año/mes
            this.ticketsTotal.push({ mes: this.monthGroup[g - 1], nuevos: Math.ceil(this.cuentame) + 1, status: Math.ceil(status), pending: Math.ceil(statusrest), open: Math.ceil(this.statusopen) });
            this.cuentame = 1;
            status = 0;
            statusrest = 0;
            this.statusopen = 0;


            if (this.ticketsjson[g].status === "solved") {
              status++;
            } else if (this.ticketsjson[g].status === "pending") {
              statusrest++;
            }
          }
        } else {
          this.cont++;

        }
      }
      //asignamos el ultimo valor del array ticketstotal que es el que actualmente esta mas actualizado como ultimo registro
      this.ticketsTotal.push({ mes: this.monthGroup[this.monthGroup.length - 1], nuevos: Math.ceil(this.cuentame), status: Math.ceil(status), pending: Math.ceil(statusrest), open: Math.ceil(this.statusopen) });

      if (this.ticketsTotal) {
        this.shared.getMonthStadistic(this.ticketsTotal)
      }
       this.totalSum();
    });


  }
  //--------------------------------------------------------------------------------------------------------------------------------------------
  //fin de la informacion de los tickets
  //---------------------------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------------------------------------------
  //Comprobamos los tickets reabiertos
  //---------------------------------------------------------------------------------------------------------------------------------------------
  reopen() {
    let audits: any = [];
    let events: any = [];

    this.ticketsjson = this.ticketsjson.map(t => {

      if (['pending', 'open'].indexOf(t.status) > -1) {
        const candidats = t.audits.filter(a => {

          return a.events.filter(e => e.type === 'Change' && e.previous_value === 'solved').length > 0;
        });
        if (candidats && candidats.length > 0) {
          t['reOpened'] = true;

          if (t.reOpened) {
            this.statusopen++;
          }
        }
      }
      return t;
    });

  }
  //--------------------------------------------------------------------------------------------------------------------------------------------
  //fin de la comprobacion de los tickets reabiertos
  //--------------------------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------------------------------------------
  // Recoger el valor del boton pulsado para obtener un grafico segun los tickets mensuales
  //--------------------------------------------------------------------------------------------------------------------------------------------
  graficbuttom(monthSelected: string) {
    this.shared.getButtomPressed(monthSelected);
  }

  phonebuttom(monthSelected: string) {
    this.shared.getButtomPressed(monthSelected);
  }

  webbuttom(monthSelected: string) {
    this.shared.getButtomPressed(monthSelected);
  }

  filterbuttom(monthSelected: string) {
    this.shared.getButtomPressed(monthSelected);
  }

  totalSum(){
    this.ticksum = [];
    let newtickets = 0;
    let statustickets = 0;
    let pendingtickets = 0;
    let reopentickets = 0;

    for (let i=0; i<this.ticketsTotal.length; i++){
       newtickets= newtickets+this.ticketsTotal[i].nuevos;
       statustickets= statustickets+this.ticketsTotal[i].status;
       pendingtickets= pendingtickets+this.ticketsTotal[i].pending;
       reopentickets= reopentickets+this.ticketsTotal[i].open;
    }
    this.ticksum.push({nuevos: newtickets, status: statustickets, pending: pendingtickets, reabiertos: reopentickets});

  }

}
