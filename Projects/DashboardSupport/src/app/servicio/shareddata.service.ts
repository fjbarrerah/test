import { Injectable } from '@angular/core';

@Injectable()
export class ShareddataService {
  fin: any;
  ini: any;
  comp: any;
  monthActual: any;
  ticketsUnSucced: any;
  ticketsSuccAns: any;
  monthTickets: any;
  fork: any;
  webTickets: any;
  lang: string;
  role: string;
  orgTickets: any;
  dataTickets: any[];
  ansMonth: string;
  auditsId: any[];
  call: any[];
  ticketsTotalAnual: any[];
  data: {
    [key: string]: {
      mes: string;
      total: number;
      web: number;
      tel: number;
      elements: any[];
    }
  } = {};
  monthSelected: string;
  ticketsTotal: any[];

  constructor() { }
  getMonthStadistic(ticketsTotal: any[]) {
    this.ticketsTotal = ticketsTotal;
  }
  setMonthStadistic() {
    return this.ticketsTotal;
  }
  getButtomPressed(monthSelected: string) {
    this.monthSelected = monthSelected;
  }
  setButtomPressed() {
    return this.monthSelected;
  }
  getArrayGroup(data: {}) {
    this.data = data;
  }
  setArrayGroup() {
    return this.data;
  }
  getArrayTotal(ticketsTotal: any[]) {
    this.ticketsTotalAnual = ticketsTotal
  }
  setArrayAnual() {
    return this.ticketsTotalAnual;
  }
  getCallRecieved(call:any[]){
    this.call = call;
  }
  setCallRecieved(){
    return this.call;
  }
  getAnsMonth(ansMonth:string){
    this.ansMonth = ansMonth;
  }
  setAnsMonth(){
    return this.ansMonth;
  }
  totalData(totalData:any){
    this.dataTickets = totalData;
  }
  settotalData(){
    return this.dataTickets;
  }
  getAudId(auditsId:any){
    this.auditsId = auditsId;
  }
  setAudId(){
    return this.auditsId;
  }
  getOrgTickets(res:any){
    this.orgTickets = res
  }
  setOrgTickets(){
    return this.orgTickets;
  }

  getWebTickets(res:any){
    this.webTickets = res
  }
  setWebTickets(){
    return this.webTickets;
  }

  getForkjoin(res:any){
    this.fork = res;
  }

  setForkjoin(){
    return this.fork;
  }

  getMonthTickets(res:any){
    this.monthTickets = res;

  }

  setMonthTickets(){
    return this.monthTickets;
  }

  getTicketsAnsSucc(res){
    this.ticketsSuccAns = res;
  }
  getTicketsAnsNoSucc(res){
    this.ticketsUnSucced = res;
  }


  setTicketsAnsSucc(){
    return this.ticketsSuccAns;
  }
  setTicketsAnsNoSucc(){
    return this.ticketsUnSucced;
  }


  getActualMonth(res){
    this.monthActual = res;

  }
  setActualMonth(){
   return this.monthActual;

  }

  getTicketscomp(res){
    this.comp = res;

  }
 setTicketscomp(){
    return this.comp;
  }

  sendDate(res){
    this.ini = res;
  }

  sendDate2(res){
    this.fin=res;
  }

  getDate(){
    return this.ini;
  }

  getDate2(){
    return this.fin;
  }
}
