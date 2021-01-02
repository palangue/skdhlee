import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

import { DeviceService } from '../../device.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { OrderService } from '../../order.service';
import { IPayPlan } from '../../../models/PaymentPlan';



@Component({
  selector: 'app-promo-item',
  templateUrl: './promo-item.component.html',
  styleUrls: ['./promo-item.component.css']
})
export class PromoItemComponent implements OnInit, OnDestroy {

  // Firestorage Reference 를 이용해서 getDownloadUrl() 호출 시 404 에러가 계속 뜸. 이유를 모르겠음
  // Firestorage 에 있는 Url 정보를 Phone DB 에 그대로 적재함.

  deviceHeaderColumnInfo = ['payPlanName', 'publicPrice', 'newDevice', 'moveNumber', 'changeDevice' ];
  deviceSecondHeaderColumnInfo = ['monthPay'];

  @Input() deviceXs: boolean;

  // 로그인 된 프로모션 코드
  itemPage_promoCode: string;   // 사용자 입력 프로모션 코드
  //itemPageDocumentId: string;   // 검색 된 프로모션 코드 문서

  gov_price: number;
  agreement_price_max: number;
  support_price: number;


  phoneListSub: Subscription;
  payPlan: Array<IPayPlan>;

  // 단말기 전체 리스트
  public items: Array<PHONE_DETAIL>;
  // 프로모션 (복지금) 가격 리스트
  supportDeviceList: Array<any>;
  publicPriceList: Array<any>;

  allInfo$: Observable<{ phoneLists: any[]; payPlans: IPayPlan[]; promotions: any[] }>;
  // all$: Observable<{ burgers: any[]; donuts: any[] }>;
  ObservablePhone: Observable<any[]>;
  ObservablePayPlan: Observable<any[]>;

  joined$: Observable<any>;

  constructor(
    private firestore: AngularFirestore,
    private deviceService: DeviceService,
    private orderService: OrderService,
    private route: Router) {
  }

  ngOnInit(): void {

    console.log('deviceXs = ',this.deviceXs);

    // 로그인 시 저장 된 프로모션 코드 가져오기
    this.itemPage_promoCode = this.deviceService.getUserPromoCode();

    if (this.itemPage_promoCode.length === 0) {
      alert('행사 코드를 수집하지 못했습니다. 새로고침 해 주세요');
      return;
    }

    // 모든 데이터를 한번에 가져와서 그냥 담아 놓음
    //this.setPhoneAndPrices();

    // switchMap 사용. 모든 데이터를 한번에 가져 온다.
    this.GetAllDeviceInfomations();

    //this.setPhoneAndPrices();


    // this.getPhonePrice();

    // // TODO: 프로모션 코드로 행사 가격을 가져 와야 한다.
    // this.getPhoneList();
    // // 공시지원금 가져오기
    // this.getPublicPrice();
  }

  ngOnDestroy(): void {
    this.phoneListSub?.unsubscribe();
  }

  setPhoneAndPrices(): void {
    this.allInfo$ = combineLatest([
      this.firestore.collection('Phone').valueChanges(),
      this.firestore.collection<IPayPlan>('PayPlan').valueChanges(),
      this.firestore.collection('Promotion').doc(this.itemPage_promoCode).collection('support_device').valueChanges()
    ]).pipe(
      map(([phoneLists, payPlans, promotions]) => {
        return { phoneLists, payPlans, promotions };
      })
    );
    this.allInfo$.subscribe(ref => {
      console.log('All data = ', ref)
    });
  }

  // switchMap 사용
  GetAllDeviceInfomations(): void {

    this.joined$ = this.firestore
      .collection<any>('Phone')
      .valueChanges().pipe(
        switchMap((PhoneLists) => {
          // const modelName = PhoneLists.map(result => result.ModelName);

          return combineLatest([
            of(PhoneLists),
            this.firestore.collection('Promotion').doc(this.itemPage_promoCode)
              .collection('support_device').valueChanges(),
            this.firestore.collection<IPayPlan>("PayPlan").valueChanges()
          ]);
        }),
        map(([list1, list2, list3]) => {
          return list1.map(result => {

            // PayPlan 의 값을 프로모션 데이터로 검색해서 동일한 값이 있을 때 프로모션 데이터를 갱신
            const searchData = list2.filter(a => {
              if (a.deviceName === result.ModelName) {
                a.monthPay = (list3.find(x => x.name === a.planName)?.monthPay)
                return list2;
              }
            });

            // 내림 차순 정렬 추가
            return {
              ...result,
              plans: searchData.sort((x,y) => x.monthPay > y.monthPay ? -1: 1),
            }
          })
        })

      );
      this.joined$.subscribe(ref => console.log('SwitchMap data = ', ref));
  }


  getPhoneList(): void {
    this.phoneListSub?.unsubscribe();

    this.phoneListSub = this.firestore.collection('Phone')
      .snapshotChanges()
      .pipe(map(ref => {
        return ref.map((a: any) => {
          const data = a.payload.doc.data();
          const idx = a.payload.doc.id;

          return { idx, ...data };
        });
      })).subscribe(ref => {
        // console.log('Get Phone List', ref);
        this.items = Array.from(ref);
      });
  }

  btnBuy(pd: PHONE_DETAIL): void {
    this.orderService.setSelectPhone(pd);
    this.route.navigate(['orders']);
  }
  btnDetail(pd: PHONE_DETAIL): void {
    // console.log('상세보기 클릭함', pd);
    //this.getPhonePrice();
  }

  // 프로모션 코드를 이용해서 지원 단말기의 전체 요금표를 가져온다.
  getPhonePrice(): void {

    if (!this.itemPage_promoCode) {
      alert('행사 문서를 읽지 못했습니다. 페이지를 다시 로드 해 주세요');
      return;
    }

    this.firestore.collection('Promotion')
      .doc(this.itemPage_promoCode)
      .collection('support_device')
      .snapshotChanges()
      .pipe(take(1), map(result => {
        return result.map(resultData => {
          const idx = resultData.payload.doc.id;
          const data = resultData.payload.doc.data();

          return { idx, ...data };
        });
      })).subscribe(realData => {
        this.supportDeviceList = realData;
      });
  }

  // 요금제 표에 등록 된 공시 지원 요금을 가져온다
  getPublicPrice(): void {
    this.firestore.collection('PayPlan')
      .snapshotChanges().pipe(map(ref => {
        return ref.map((data: any) => {
          const returnData = data.payload.doc.data();
          const idx = data.payload.doc.id;

          return { idx, ...returnData };
        });
      }))
      .subscribe((ref: IPayPlan[]) => {
        this.payPlan = ref;
        //console.log('Get Public Price = ', this.payPlan);
      });
  }

  getNumber(data: string): number {
    return Number(data);
  }

  GetPublicMoney(modelName: string, devicePrice: string): number {
    const tempData = this.supportDeviceList.find(x => x.deviceName === modelName);

    console.log(tempData);

    return 0;
  }

  GetNewDeviceMoney(modelName: string, devicePrice: string): number {
    const tempData = this.supportDeviceList.filter(x => x.deviceName === modelName);

    console.log(tempData, modelName, devicePrice, this.supportDeviceList);
    // 동일한 네트워크의 요금제에 대한 공시 지원금을 가져온다.
    // const newDevicePrice = this.payPlan.find(x => x.netKind === 'newDevice' && x.name === '네트워크 이름');
    // const devicePublicPrice  = newDevicePrice.publicPrice;
    // newDevicePrice.name
    // newDevicePrice.netKind
    // console.log(this.payPlan, devicePublicPrice);

    return 0;
  }
  GetChangeDeviceMoney(modelName: string, devicePrice: string): number {

    return 0;
  }
  GetMoveNumberMoney(modelName: string, devicePrice: string): number {

    return 0;
  }
}

