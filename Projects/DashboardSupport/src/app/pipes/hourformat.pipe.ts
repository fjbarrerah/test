import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourformat'
})
export class HourformatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let hour =0;
    let minutes=0;
    let seconds =0;
    let fullhour:string;
    let days=0;
    for (let x =0; x < value; x++){
      seconds ++;
      if(seconds === 60){
        minutes++;
        seconds=0;
      }
      if(minutes === 60){
        hour++;
        minutes=0;
      }
      if(hour===24){
        days++
        hour=0;
      }
    }
    fullhour=hour+":"+minutes+":"+seconds
    return fullhour;
  }
}
