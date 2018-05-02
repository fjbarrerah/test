import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../../servicio/shareddata.service';

@Component({
  selector: 'app-anualchart',
  templateUrl: './anualchart.component.html',
  styleUrls: ['./anualchart.component.css']
})
export class AnualchartComponent implements OnInit {
  totals: any[];
  data: { [key: string]: { mes: string; total: number; web: number; tel: number; elements: any[]; }; };
  pieChartData: {};

  constructor(private shared: ShareddataService) { }

  ngOnInit() {
    window.location.assign('/ticketsyear');
  this.createchart();
  }

  anualGraphic() {
    this.data =this.shared.setArrayGroup();
    this.totals = this.shared.setArrayAnual();

  }

  createchart() {
    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Nuevos', 22],
        ['Resueltos',11],
        ['Pendientes', 33],


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
