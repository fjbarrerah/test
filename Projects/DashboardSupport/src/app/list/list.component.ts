import { Component, OnInit } from '@angular/core';
import { LoginService } from '../servicio/login.service';
import { SimuladorService } from '../servicio/simulador.service';
import { ShareddataService } from '../servicio/shareddata.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  opcionSeleccionado: string = "0"
  admin: boolean= false;
  constructor(public log: LoginService,
    public simu:SimuladorService,
    public shared:ShareddataService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
  }

  language(event: any){
    this.translate.use(event.target.value);
    localStorage.setItem("lang", event.target.value);
  }

}
