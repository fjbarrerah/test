import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../../servicio/simulador.service';
import { element } from 'protractor';
import { ShareddataService } from '../../servicio/shareddata.service';

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.css']
})
export class YearsComponent implements OnInit {


  totalanual: any[];
  webEmailCounter: number;
  ticketsTotal: any[];
  ticketsjson: any;

  data = {};
  constructor(private simu: SimuladorService,
    private shared: ShareddataService
  ) { }

  ngOnInit() {
    this.ticketsTotal = []
    this.simu.getJSON().subscribe(res => {
      let data: {
        [key: string]: {
          mes: string;
          total: number;
          web: number;
          tel: number;
          elements: any[];
        }
      } = {};

      for (let i = 0; i < res.length; i++) {
        const mesAct = res[i].created_at.substring(0, 7);
        if (!data[mesAct]) {
          data[mesAct] = {
            mes: mesAct,
            total: 0,
            web: 0,
            tel: 0,
            elements: [],
          };
        };
        data[mesAct].elements.push(res[i]);
      }
      this.data = data;
      this.getTotal();
      this.getEmailWeb();
      this.getPhones();
      this.getTotals();

    });
  }

  getTotal(): void {
    for (const key of Object.keys(this.data)) {
      this.data[key].total = this.data[key].elements.length;
    }
  }


  getEmailWeb(): void {
    for (const key of Object.keys(this.data)) {
      for (let x = 0; x < this.data[key].elements.length; x++) {
        if (this.data[key].elements[x].via.channel === "web" || this.data[key].elements[x].via.channel === "email") {
          this.data[key].web++;
        }

      }
    }
  }

  getPhones() {
    for (const key of Object.keys(this.data)) {
      for (let x = 0; x < this.data[key].elements.length; x++) {
        if (this.data[key].elements[x].via.channel === "voice") {
          this.data[key].tel++;
        }

      }

    }

  }
  getTotals() {
    let totalsum: number = 0;
    let websum: number = 0;
    let telsum: number = 0;
    for (const key of Object.keys(this.data)) {
      totalsum = this.data[key].total + totalsum;
      websum = this.data[key].web + websum;
      telsum = this.data[key].tel + telsum;
    }
    this.ticketsTotal.push({ total: totalsum, web: websum, tel: telsum });
  }

  sendData(){
    this.shared.getArrayGroup(this.data);
    this.shared.getArrayTotal(this.ticketsTotal);
  }
}
