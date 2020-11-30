import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IPaymentPlan } from '../models/PaymentPlan';
import { PHONE_DETAIL } from '../models/PhoneDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private pricing = new Subject();
  private readonly pricingObserv = this.pricing.asObservable();
  private installment = new Subject();
  private readonly installmentObserv = this.installment.asObservable();

  user_selected_phone: PHONE_DETAIL;

  Database: AngularFirestore;

  private CollectionArray = {};
  private CollectionRef = {};

  constructor(db: AngularFirestore) {
    this.Database = db;
  }
  //#region 요금 데이터
  sendPricing(price?: IPaymentPlan) {
    this.pricing.next(price);
  }
  getPricingObserv() {
    return this.pricingObserv;
  }
  sendInstallment(installment?: string) {
    this.installment.next(installment);
  }
  getInstallmentObserv() {
    return this.installmentObserv;
  }
  //#endregion

  getSelectedPhone() {
    return this.user_selected_phone;
  }
  setSelectPhone(selected: PHONE_DETAIL) {
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
