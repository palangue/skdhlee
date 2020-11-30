import { IPaymentPlan, IUserPlan, IPlan, IPayPlan } from './../../../models/PaymentPlan';
import { MatTableDataSource } from '@angular/material/table';
import { GroupedObservable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, OnDestroy, ɵConsole } from '@angular/core';


export interface PlanDataGroup {
  name: string;
  value: IPayPlan[];
}

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit, OnDestroy {

  planColumnData = ['payment', 'monthPay', 'monthlyDiscount', 'totallyDiscount', 'afterMonthPay'];
  planSub: Subscription;

  planList: IUserPlan[];
  payPlan: IPayPlan[] = [];

  planGroupData: PlanDataGroup[] = [];


  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.planSub = this.firestore.collection('PayPlan')
      .valueChanges()
      .subscribe((ref: IPayPlan[]) => {

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
        console.log("class result = ", this.planGroupData);




        // this.payPlan.sort((a, b) => {
        //   return (a.netKind > b.netKind) ? 1 : -1;
        // });

      });
  }
  ngOnDestroy(): void {
    if (this.planSub) {
      this.planSub.unsubscribe();
    }
  }

  addPayPlan(): void {
    console.log('요금제 추가');
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }
}
