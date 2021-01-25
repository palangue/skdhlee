import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';

import { PHONE_DETAIL } from '../models/PhoneDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private publicPrice = new Subject();
  private readonly publicPriceObserv = this.publicPrice.asObservable();
  private pricing = new Subject();
  private readonly pricingObserv = this.pricing.asObservable();
  private installment = new Subject();
  private readonly installmentObserv = this.installment.asObservable();
  private supportMoney = new Subject();
  private readonly supportMoneyObserv = this.supportMoney.asObservable();
  private deviceInstallment = new Subject();
  private readonly deviceInstallmentObserv = this.deviceInstallment.asObservable();

  user_selected_phone: PHONE_DETAIL;

  Database: AngularFirestore;

  private CollectionArray = {};
  private CollectionRef = {};

  constructor(db: AngularFirestore) {
    this.Database = db;
  }
  //#region 요금 데이터
  // 공시 지원금
  sendPublicPrice(publicPrice?: any){
    this.publicPrice.next(publicPrice);
  }
  getPublicPriceObserv(){
    return this.publicPriceObserv;
  }
  // 월 통신 요금
  sendPricing(price?: any) {
    this.pricing.next(price);
  }
  getPricingObserv() {
    return this.pricingObserv;
  }
  // 선택약정 할부 개월 수
  sendInstallment(installment?: number) {
    this.installment.next(installment);
  }
  getInstallmentObserv() {
    return this.installmentObserv;
  }
  // 복지지원금 (임직원할인)
  sendSupportMoney(supportMoney?: number){
    this.supportMoney.next(supportMoney);
  }
  getSupportMoneyObserv(){
    return this.supportMoneyObserv;
  }
  // 단말기 할부 개월
  sendDeviceInstallment(installment?: number){
    this.deviceInstallment.next(installment);
  }
  getDeviceInstallment(){
    return this.deviceInstallmentObserv;
  }
  //#endregion

  getSelectedPhone() {
    return this.user_selected_phone;
  }
  setSelectPhone(selected: PHONE_DETAIL) {
    console.log(selected);
    this.user_selected_phone = selected;
  }

  getPromoCollection(DbName: string, promo: string) {
    if (this.CollectionRef[DbName] == null)
      this.CollectionRef[DbName] = this.Database.collection(DbName, ref => {
        return ref.where('promotion_target', '==', 'promo');
      }).valueChanges();

    return this.CollectionRef[DbName];
  }

  getPayPlan() {
    if (this.CollectionRef['PayPlan'] == null) {
      this.CollectionRef['PayPlan'] = this.Database.collection<any>('PayPlan', ref => {
        return ref;
      }).valueChanges({ idField: 'idx' });
    }

    return this.CollectionRef['PayPlan'];
  }


}
