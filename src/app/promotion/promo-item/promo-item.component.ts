import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { DeviceService } from '../../device.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { OrderService } from '../../order.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-promo-item',
  templateUrl: './promo-item.component.html',
  styleUrls: ['./promo-item.component.css']
})
export class PromoItemComponent implements OnInit, OnDestroy {

  // Firestorage Reference 를 이용해서 getDownloadUrl() 호출 시 404 에러가 계속 뜸. 이유를 모르겠음
  // Firestorage 에 있는 Url 정보를 Phone DB 에 그대로 적재함.

  @Input() deviceXs: boolean;

  // 로그인 된 프로모션 코드
  itemPage_promoCode: string;

  gov_price: number;
  agreement_price_max: number;
  support_price: number;

  currentTimestamp: number = new Date().getTime();

  phoneListSub: Subscription;

  // 단말기 전체 리스트
  public items: Array<PHONE_DETAIL>;

  constructor(
    private firestore: AngularFirestore,
    private deviceService: DeviceService,
    private orderService: OrderService,
    private route: Router) {
  }

  ngOnInit(): void {
    this.itemPage_promoCode = this.deviceService.getUserPromoCode();
    console.log(this.itemPage_promoCode);

    // this.deviceService.getDeviceDb('Phone').valueChanges({ idField: 'idx' })
    //   .pipe(take(1))
    //   .subscribe(
    //     res => {
    //       this.items = res;
    //     }
    //   );
    this.getPhoneList();
  }

  ngOnDestroy(): void {

  }

  getPhoneList(): void {
    if (this.phoneListSub) { this.phoneListSub.unsubscribe(); }

    this.phoneListSub = this.firestore.collection('Phone').snapshotChanges().pipe(map( ref=>{
      return ref.map( (a: any) =>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;

        return {id, ...data};
      });
    })).subscribe(ref => {
      
      this.items = Array.from(ref);
      console.log(this.items);
      // this.dataSource = new MatTableDataSource(this.phoneList);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
  }

  btnBuy(pd: PHONE_DETAIL): void {
    this.orderService.setSelectPhone(pd);
    this.route.navigate(['orders']);
  }
  btnDetail(pd: PHONE_DETAIL): void {
    console.log('상세보기 클릭함', pd);

  }

  // 시작 날짜에서 오늘 날짜까지 보여준다
  getTimeComparison(date): boolean {
    if (date > this.currentTimestamp) { return true; }

    return false;
  }

  dateTimeCallback(event: number): void {
    this.currentTimestamp = event;
  }
}

