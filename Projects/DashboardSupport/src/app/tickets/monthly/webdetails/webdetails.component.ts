import { Component, OnInit } from '@angular/core';
import { ShareddataService } from '../../../servicio/shareddata.service';

@Component({
  selector: 'app-webdetails',
  templateUrl: './webdetails.component.html',
  styleUrls: ['./webdetails.component.css']
})
export class WebdetailsComponent implements OnInit {

  webTicket: any;
  constructor(private shared: ShareddataService) { }

  ngOnInit() {
    this.webTicket = this.shared.setWebTickets();
  }
}
