import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { IPayPlan } from '../../../models/PaymentPlan';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit, OnDestroy {

  planName = 'LTE 평생요금';
  netKind = 'LTE';
  monthPay = 125000;
  monthlyPay = 31295;
  totallyPay = 751080;
  afterPay = 93705;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {

  }

  btnSavePlan(): void {

    let plan: IPayPlan =
    {
      name: this.planName,
      netKind: this.netKind,
      actualMonthPay: this.afterPay,
      monthPay: this.monthPay,
      monthlyPay: this.monthlyPay,
      totallyPay: this.totallyPay
    };

    this.firestore.collection('PayPlan').add(plan);
  }
}
