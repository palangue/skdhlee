import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IPayPlan } from '../../../models/PaymentPlan';
import { IPlanDialogResult } from './../../../models/PaymentPlan';


@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit, OnDestroy {

  displayType = '';

  currentPlan: IPayPlan;
  index = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PlanDetailComponent>,
    private firestore: AngularFirestore
  ) {
    if (data.IPaymentPlan === null) {
      this.displayType = 'AddPlan';
      this.currentPlan = {
        actualMonthPay: 0,
        monthPay: 0,
        monthlyPay: 0,
        netKind: '',
        name: '',
        totallyPay: 0,
      };
      this.index = '';
    }
    else {
      this.displayType = 'UpdatePlan';
      this.currentPlan = data.IPaymentPlan;
      this.index = data.IPaymentPlan.idx;
    }
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {

  }

  // 요금제 추가
  btnSavePlan(): void {
    const plan = this.currentPlan;
    this.firestore.collection('PayPlan').add(plan)
      .then(() => {
        const result: IPlanDialogResult = {
          code: 0,
          message: '성공'
        };
        this.dialogRef.close(result);
      })
      .catch((err) => {
        console.log(err);
        const result: IPlanDialogResult = {
          code: 99,
          message: err
        };
        this.dialogRef.close(result);
      });
  }

  // 요금제 수정
  btnModifyPlan(): void {
    const data = this.currentPlan;
    this.firestore.collection('PayPlan').doc(this.index).update(data)
      .then(() => {
        const result: IPlanDialogResult = {
          code: 0,
          message: '성공'
        };
        this.dialogRef.close(result);
      })
      .catch((err) => {
        console.log(err);
        const result: IPlanDialogResult = {
          code: 99,
          message: err
        };
        this.dialogRef.close(result);
      });
  }
}
