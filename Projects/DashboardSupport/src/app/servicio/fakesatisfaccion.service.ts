import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { environment } from '../../environments/environment';
@Injectable()
export class FakesatisfaccionService {

  constructor(private http: HttpClient) {
    this.getSatJSON().subscribe(data => {

    });

  }
  public getSatJSON(): Observable<any> {
    return  this.http.get("../../assets/satisfaction_ratings.json");

  }
}
