import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ShareddataService } from '../../../servicio/shareddata.service';


@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css']
})
export class StadisticsComponent implements OnInit {
  pieChartData: {};
  datos: any[];
  ticketsTotal: any[];
  month: string;


  constructor(private shared: ShareddataService) { }

  ngOnInit() {
    this.getmonth();
    this.gettickets();
    this.datos = [];
    if(!this.ticketsTotal){
      window.location.assign('/ticketsmonth');
    }
    for (let i = 0; i < this.ticketsTotal.length; i++) {
      if (this.month === this.ticketsTotal[i].mes) {
        this.datos.push({ mes: this.ticketsTotal[i].mes, nuevos: this.ticketsTotal[i].nuevos, status: this.ticketsTotal[i].status, pending: this.ticketsTotal[i].pending, open: this.ticketsTotal[i].open });
        break;
      }
    }

    this.createchart()
  }
  getmonth() {
    this.month = this.shared.setButtomPressed();
  }

  gettickets() {
    this.ticketsTotal = this.shared.setMonthStadistic();
  }
  createchart() {
    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Nuevos', this.datos[0].nuevos],
        ['Resueltos',this.datos[0].status],
        ['Pendientes', this.datos[0].pending],
        ['Reabiertos', this.datos[0].open],

      ],
      options: {
        'width': 900,
        'height': 900,
        'is3D': true,
        'legend': { position: 'bottom', textStyle: { fontSize: 18 } },
      },
    };

  }

}
