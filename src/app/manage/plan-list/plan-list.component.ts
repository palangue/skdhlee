import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { IUserPlan, IPayPlan, IPlanDialogResult, PlanDataGroup } from './../../../models/PaymentPlan';
import { PlanDetailComponent } from './../plan-detail/plan-detail.component';


@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit, OnDestroy {

  planColumnData = ['payment', 'monthPay', 'monthlyDiscount', 'totallyDiscount', 'afterMonthPay', 'modify', 'delete'];
  planSub: Subscription;

  planList: IUserPlan[];
  payPlan: IPayPlan[] = [];

  planGroupData: PlanDataGroup[] = [];


  constructor(private firestore: AngularFirestore, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.planSub = this.firestore.collection('PayPlan')
      .valueChanges({ idField: 'idx' })
      .subscribe((ref: any[]) => {
        // IPayPlan[] + idx
        this.planGroupData = [];
        this.payPlan = ref;

        // 그룹 분기
        const groups = this.uniqueBy(this.payPlan.map(ref2 => ref2.netKind), JSON.stringify);

        // 그룹 네임 설정
        groups.forEach(item => {
          let itemClass: PlanDataGroup;
          itemClass = { name: item, value: [] };
          this.planGroupData.push(itemClass);
        });

        // 각 그룹에 데이터 링크
        ref.forEach(recvData => {
          this.planGroupData.forEach(g => {
            if (g.name === recvData.netKind) {
              g.value.push(recvData);
            }
          });
        });
        console.log('class result = ', this.planGroupData);
      });
  }
  ngOnDestroy(): void {
    if (this.planSub) {
      this.planSub.unsubscribe();
    }
  }

  addPayPlan(): void {
    console.log('요금제 추가');
    const dialogRef = this.dialog.open(PlanDetailComponent, {
      data: { width: '400px', Index: null, IPaymentPlan: null }
    });
    dialogRef.afterClosed().subscribe((result: IPlanDialogResult) => {
      if (result.code === 0) {
        alert('성공');
      }
      else {
        alert(result.message);
      }
    });
  }

  modifyPayPlan(item): void {
    const dialogRef = this.dialog.open(PlanDetailComponent, {
      data: { Width: '400px', Index: item.idx, IPaymentPlan: item }
    });
    dialogRef.afterClosed().subscribe((result: IPlanDialogResult) => {
      if (result.code === 0) {
        alert('성공');
      }
      else {
        alert(result.message);
      }
    });
  }
  // 요금제 삭제
  deletePayPlan(item): void {
    this.firestore.collection('PayPlan').doc(item.idx).delete();
  }

  uniqueBy(a, key): any {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }
}
