import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Angular2Csv } from 'angular2-csv';
import { ShareddataService } from '../../../servicio/shareddata.service';
import { SimuladorService } from '../../../servicio/simulador.service';

@Component({
  selector: 'app-yearsfilter',
  templateUrl: './yearsfilter.component.html',
  styleUrls: ['./yearsfilter.component.css']
})
export class YearsfilterComponent implements OnInit {

  botonfilter: boolean = true;
  organivisible: boolean = false;
  estadovisible: boolean = false;
  fechavisible: boolean = false;
  options: any[] = [];
  showTickets: any[] = [];
  tickets: any[] = [];
  constructor(private shared: ShareddataService,
    private simu: SimuladorService) { }

  ngOnInit() {
    this.getTickets();
  }

  getTickets() {
    return Observable.forkJoin(
      this.simu.getOnlyTickets(),
      this.simu.getOrg()
    )
      .subscribe((res: any) => this.setResult(res))
  }


  setResult(res) {
    this.shared.getForkjoin(res);
    for (let i = 0; i < res[0].tickets.length; i++) {
      for (let x = 0; x < res[1].organizations.length; x++) {
        if (res[1].organizations[x].id === res[0].tickets[i].organization_id) {
          this.tickets.push({ creado: res[0].tickets[i].created_at.substring(0, 10), ticket_number: res[0].tickets[i].id, status: res[0].tickets[i].status, organization: res[1].organizations[x].name, entry: res[0].tickets[i].via.channel })
        }
      }
    }
    this.showTickets = this.tickets;
    this.setOrganizations();
    this.shared.getMonthTickets(this.tickets);
  }
  setOrganizations() {
    const variable = this.shared.setForkjoin()
    for (let i = 0; i < variable[1].organizations.length; i++) {
      this.options.push({ id: variable[1].organizations[i].id, name: variable[1].organizations[i].name })
    }
  }

  filterdata(id) {
    this.showTickets = [];
    const filtertickets = this.shared.setMonthTickets();

    if (id === "open") {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].status === "open") {
          this.showTickets.push({ creado: filtertickets[i].creado.substring(0, 10), ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }

    } else if (id === "closed") {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].status === "closed") {
          this.showTickets.push({ creado: filtertickets[i].creado.substring(0, 10), ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }

    } else if (id === "pending") {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].status === "pending") {
          this.showTickets.push({ creado: filtertickets[i].creado.substring(0, 10), ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }

    } else if (id === "solved") {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].status === "solved") {
          this.showTickets.push({ creado: filtertickets[i].creado.substring(0, 10), ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }

    }
  }

  filterorg(name) {
    this.showTickets = [];
    const filtertickets = this.shared.setMonthTickets();
    for (let i = 0; i < filtertickets.length; i++) {
      if (filtertickets[i].organization === name) {
        this.showTickets.push({ creado: filtertickets[i].creado.substring(0, 10), ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
      }
    }
  }

  filterdate(inicio: string, fin: string) {
    this.showTickets = [];
    const filtertickets = this.shared.setMonthTickets();

    if (!inicio && !fin) {
      alert('inserta una fecha')
    } else if (!fin) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].creado >= inicio) {
          this.showTickets.push({ creado: filtertickets[i].creado, ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }
    } else if (!inicio) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].creado <= fin) {
          this.showTickets.push({ creado: filtertickets[i].creado, ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }
    }
    else if (inicio && fin) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].creado >= inicio && filtertickets[i].creado <= fin) {
          this.showTickets.push({ creado: filtertickets[i].creado, ticket_number: filtertickets[i].ticket_number, status: filtertickets[i].status, organization: filtertickets[i].organization, entry: filtertickets[i].entry })
        }
      }
    }
  }


  typeOption(res) {
    if (res === "fecha") {
      this.fechavisible = true;
      this.estadovisible = false;
      this.organivisible = false;
    } else if (res === "estado") {
      this.fechavisible = false;
      this.estadovisible = true;
      this.organivisible = false;

    } else if (res === "organizacion") {
      this.fechavisible = false;
      this.estadovisible = false;
      this.organivisible = true;

    }

  }
  exportCsv() {
    new Angular2Csv(this.showTickets, 'My Report');
  }

  advancedFilter() {
    this.showTickets = [];
    if (this.botonfilter) {
      this.botonfilter = !this.botonfilter;
      this.fechavisible = true;
      this.estadovisible = true;
      this.organivisible = true;
    } else {
      this.botonfilter = !this.botonfilter;
      this.fechavisible = false;
      this.estadovisible = false;
      this.organivisible = false;
    }
  }

  bigFilter(name, id) {
    this.showTickets = [];
    let ordname: any[] = [];
    let ordini: any[] = [];
    let ordfin: any[] = [];
    let ordtotal: any[] = [];
    const ini = this.shared.getDate();
    const fin = this.shared.getDate2();

    const advancedTickets = this.shared.setMonthTickets();
    if (name) {
      for (let i = 0; i < advancedTickets.length; i++) {
        if (advancedTickets[i].organization === name) {
          ordname.push({ creado: advancedTickets[i].creado, ticket_number: advancedTickets[i].ticket_number, status: advancedTickets[i].status, organization: advancedTickets[i].organization, entry: advancedTickets[i].entry })
        }
      }
    } else {
      for (let i = 0; i < advancedTickets.length; i++) {
        ordname.push({ creado: advancedTickets[i].creado, ticket_number: advancedTickets[i].ticket_number, status: advancedTickets[i].status, organization: advancedTickets[i].organization, entry: advancedTickets[i].entry })
      }
    }

    if(ini){
      for (let i = 0; i < ordname.length; i++) {
        if (ordname[i].creado >= ini) {
          ordini.push({ creado: ordname[i].creado, ticket_number: ordname[i].ticket_number, status: ordname[i].status, organization: ordname[i].organization, entry: ordname[i].entry })
        }
      }
    }else {
      for (let i = 0; i < ordname.length; i++) {
        ordini.push({ creado: ordname[i].creado, ticket_number: ordname[i].ticket_number, status: ordname[i].status, organization: ordname[i].organization, entry: ordname[i].entry })
      }
    }

    if(fin){
      for (let i = 0; i < ordini.length; i++) {
        if (ordini[i].creado <= fin) {
          ordfin.push({ creado: ordini[i].creado, ticket_number: ordini[i].ticket_number, status: ordini[i].status, organization: ordini[i].organization, entry: ordini[i].entry })
        }
      }
    }else {
      for (let i = 0; i < ordini.length; i++) {
        ordfin.push({ creado: ordini[i].creado, ticket_number: ordini[i].ticket_number, status: ordini[i].status, organization: ordini[i].organization, entry: ordini[i].entry })
      }
    }

    if(id){
      for (let i = 0; i < ordini.length; i++) {
        if (ordini[i].status === id) {
          ordtotal.push({ creado: ordfin[i].creado, ticket_number: ordfin[i].ticket_number, status: ordfin[i].status, organization: ordfin[i].organization, entry: ordfin[i].entry })
        }
      }
    }else {
      for (let i = 0; i < ordfin.length; i++) {
        ordtotal.push({ creado: ordfin[i].creado, ticket_number: ordfin[i].ticket_number, status: ordfin[i].status, organization: ordfin[i].organization, entry: ordfin[i].entry })
      }
    }

  this.showTickets = ordtotal;
  }


  dateChange(ini) {
    this.shared.sendDate(ini)
  }
  dateChange2(fin) {
    this.shared.sendDate2(fin)
  }
}
