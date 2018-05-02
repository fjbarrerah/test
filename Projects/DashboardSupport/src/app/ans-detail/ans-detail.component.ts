import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../servicio/shareddata.service';
import { SimuladorService } from '../servicio/simulador.service';
import { Angular2Csv } from 'angular2-csv';

@Component({
  selector: 'app-ans-detail',
  templateUrl: './ans-detail.component.html',
  styleUrls: ['./ans-detail.component.css']
})
export class AnsDetailComponent implements OnInit {

  options: any[] = [];
  botonfilter: boolean=true;
  fechavisible: boolean=false;
  estadovisible: boolean=false;
  organivisible: boolean=false;
  showTickets: any[] = [];
  tickets: any;
  constructor(private shared: ShareddataService,
    private simu: SimuladorService) { }

  ngOnInit() {
    this.getTickets();
  }

  getTickets() {
    this.tickets = this.shared.setTicketsAnsSucc();
    this.simu.getOrg().subscribe((res: any) => {
      this.shared.getTicketscomp(res.organizations);
      for (let i = 0; i < res.organizations.length; i++) {
        for (let x = 0; x < this.tickets.length; x++) {
          if (this.tickets[x].organization === res.organizations[i].id) {
            this.showTickets.push({ ticket_id: this.tickets[x].ticket_id, priority: this.tickets[x].priority, created: this.tickets[x].created.substring(0, 10), updated: this.tickets[x].updated.substring(0, 10), organization: res.organizations[i].name })
          }
        }
      }
      this.setOrganizations();
    })

    this.shared.getMonthTickets(this.tickets);
  }

  setOrganizations() {
    const variable = this.shared.setTicketscomp()
    for (let i = 0; i < variable.length; i++) {
      this.options.push({ id: variable[i].id, name: variable[i].name })
    }
  }

  filterorg(name) {
    const org = this.shared.setTicketscomp(); this.showTickets = [];
    const filtertickets = this.shared.setMonthTickets();
    for (let i = 0; i < filtertickets.length; i++) {
      if (filtertickets[i].organization === parseInt(name)) {
        for (let x = 0; x < org.length; x++) {
          if (parseInt(name) === org[x].id) {
            this.showTickets.push({ ticket_id: filtertickets[i].ticket_id, priority: filtertickets[i].priority, created: filtertickets[i].created.substring(0, 10), updated: filtertickets[i].updated.substring(0, 10), organization: org[x].name })
          }
        }
      }
    }
  }

  filterdate(inicio: string, fin: string) {
    this.showTickets = [];
    const filtertickets = this.shared.setMonthTickets();
    const org = this.shared.setTicketscomp();


    if (!inicio && !fin) {
      alert('inserta una fecha')
    } else if (!fin) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].created.substring(0, 10) >= inicio) {
          for (let x = 0; x < org.length; x++) {
            if (org[x].id === filtertickets[i].organization) {
              this.showTickets.push({ ticket_id: filtertickets[i].ticket_id, priority: filtertickets[i].priority, created: filtertickets[i].created.substring(0, 10), updated: filtertickets[i].updated.substring(0, 10), organization: org[x].name })
            }
          }
        }
      }
    } else if (!inicio) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].created.substring(0, 10) <= fin) {
          for (let x = 0; x < org.length; x++) {
            if (org[x].id === filtertickets[i].organization) {
              this.showTickets.push({ ticket_id: filtertickets[i].ticket_id, priority: filtertickets[i].priority, created: filtertickets[i].created.substring(0, 10), updated: filtertickets[i].updated.substring(0, 10), organization: org[x].name })
            }
          }
        }
      }
    }
    else if (inicio && fin) {
      for (let i = 0; i < filtertickets.length; i++) {
        if (filtertickets[i].created.substring(0, 10) >= inicio && filtertickets[i].created.substring(0, 10) <= fin) {
          for (let x = 0; x < org.length; x++) {
            if (org[x].id === filtertickets[i].organization) {
              this.showTickets.push({ ticket_id: filtertickets[i].ticket_id, priority: filtertickets[i].priority, created: filtertickets[i].created.substring(0, 10), updated: filtertickets[i].updated.substring(0, 10), organization: org[x].name })
            }
          }
        }
      }
    }
  }


  typeOption(res) {
    if (res === "fecha") {
      this.fechavisible = true;
      this.organivisible = false;
    } else if (res === "organizacion") {
      this.fechavisible = false;
      this.organivisible = true;

    }

  }
  exportCsv() {
    new Angular2Csv(this.showTickets, 'My Report');
  }

  advancedFilter() {
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

  bigFilter(name) {
    this.showTickets = [];
    let ordname: any[] = [];
    let ordini: any[] = [];
    let ordfin: any[] = [];
    let ordtotal: any[] = [];
    const ini = this.shared.getDate();
    const fin = this.shared.getDate2();

let prueba:number = parseInt(name);

    const advancedTickets = this.shared.setMonthTickets();
    if (name) {
      for (let i = 0; i < advancedTickets.length; i++) {
        if (advancedTickets[i].organization === prueba) {
          ordname.push({ creado: advancedTickets[i].created, ticket_number: advancedTickets[i].ticket_id, status: advancedTickets[i].priority, organization: advancedTickets[i].organization, update: advancedTickets[i].updated })
        }
      }
    } else {
      for (let i = 0; i < advancedTickets.length; i++) {
        ordname.push({ creado: advancedTickets[i].created, ticket_number: advancedTickets[i].ticket_id, status: advancedTickets[i].priority, organization: advancedTickets[i].organization, update: advancedTickets[i].updated })
      }
    }

    if(ini){
      for (let i = 0; i < ordname.length; i++) {
        if (ordname[i].creado >= ini) {
          ordini.push({ creado: ordname[i].creado, ticket_number: ordname[i].ticket_number, status: ordname[i].status, organization: ordname[i].organization, update: ordname[i].update })
        }
      }
    }else {
      for (let i = 0; i < ordname.length; i++) {
        ordini.push({ creado: ordname[i].creado, ticket_number: ordname[i].ticket_number, status: ordname[i].status, organization: ordname[i].organization, update: ordname[i].update })
      }
    }

    if(fin){
      for (let i = 0; i < ordini.length; i++) {
        if (ordini[i].creado <= fin) {
          ordtotal.push({ creado: ordini[i].creado, ticket_number: ordini[i].ticket_number, status: ordini[i].status, organization: ordini[i].organization, update: ordini[i].update })
        }
      }
    }else {
      for (let i = 0; i < ordini.length; i++) {
        ordtotal.push({ creado: ordini[i].creado, ticket_number: ordini[i].ticket_number, status: ordini[i].status, organization: ordini[i].organization, update: ordini[i].update })
      }
    }


 this.simu.getOrg().subscribe((res:any) => {

   for(let i=0; i<ordtotal.length; i++){
    for(let x=0; x<res.organizations.length; x++){
      if(ordtotal[i].organization === res.organizations[x].id){
        this.showTickets.push({created: ordtotal[i].creado.substring(0,10), ticket_id:ordtotal[i].ticket_number, priority:ordtotal[i].status, organization:res.organizations[x].name, updated:ordtotal[i].update.substring(0,10)})
        break
      }

    }

 }


 })


  }


  dateChange(ini) {
    this.shared.sendDate(ini)
  }
  dateChange2(fin) {
    this.shared.sendDate2(fin)
  }

}
