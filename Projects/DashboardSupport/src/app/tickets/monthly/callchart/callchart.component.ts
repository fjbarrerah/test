import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../../servicio/shareddata.service';

@Component({
  selector: 'app-callchart',
  templateUrl: './callchart.component.html',
  styleUrls: ['./callchart.component.css']
})
export class CallchartComponent implements OnInit {
  call: any[];
  monthGroup: string;
  pieChartData: {};
  constructor(private shared: ShareddataService) { }

  ngOnInit() {

    this.call = this.shared.setCallRecieved();
    this.monthGroup = this.shared.setButtomPressed();
    if (!this.monthGroup) {
      window.location.assign('/ticketsmonth');
    }
    //aqui crear algo para mostrar si no hay datos de tickets y no dejar la pagina en blanco
    this.createchart();
  }

  createchart() {
    const recieved = this.call[0].recieve;
    const lost = this.call[0].lost;

    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Aceptadas', recieved],
        ['Perdidas', lost],

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
