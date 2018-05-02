import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../servicio/simulador.service';
import { FakesatisfaccionService } from '../servicio/fakesatisfaccion.service'

@Component({
  selector: 'app-satisfaccion',
  templateUrl: './satisfaccion.component.html',
  styleUrls: ['./satisfaccion.component.css']
})
export class SatisfaccionComponent implements OnInit {

  satisfacionArray: any[] = [];
  constructor(private simu: SimuladorService,
    private fake: FakesatisfaccionService) { }

  ngOnInit() {
    this.satisfaccion();
  }
  satisfaccion() {
    //   this.simu.getSatisfacc().subscribe(res => {

    //   })
    // }



    this.fake.getSatJSON().subscribe(res => {
      for (let i = 0; i < res.satisfaction_ratings.length; i++) {
        this.satisfacionArray.push({ created: res.satisfaction_ratings[i].created_at.substring(0,10), ticket_id: res.satisfaction_ratings[i].ticket_id, score: res.satisfaction_ratings[i].score, id: res.satisfaction_ratings[i].id })
      }
      console.log(this.satisfacionArray)


    })
  }
}
