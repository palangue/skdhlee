import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SupportPromotionDevice, Promotion, PromotionDialogResult } from '../../../models/Promotion';
import { DeviceService } from '../../device.service';
import { PromoDetailComponent } from '../promo-detail/promo-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { IPayPlan, PlanDataGroup } from '../../../models/PaymentPlan';
import { PromoDetailInsertComponent } from '../promo-detail-insert/promo-detail-insert.component';

export interface COMPANY {
  name: string;
  code: string;
}
@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css'],
  animations: [
    trigger('promotion_details', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ] // End Animations
})

export class PromoListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['coName', 'coCode', 'cost', 'start', 'end'];
  promotionDataSource: Promotion[];

  expandedElement: SupportPromotionDevice | null;
  promotionDeviceColumns: string[] = ['name', 'netName', 'planName', 'newDevice', 'changeDevice', 'moveNumber', 'promotion_actions'];
  promotionDeviceDataSource: SupportPromotionDevice[];

  promoCompanySub: Subscription;
  supportDeviceSub: Subscription;
  phoneListSub: Subscription;
  payPlanListSub: Subscription;

  // 단말기 리스트
  phoneList: Array<PHONE_DETAIL>;
  // 요금제 리스트
  payPlanList: Array<IPayPlan>;
  // 통신망 별 요금제 리스트 그룹
  planGroupData: Array<PlanDataGroup> = [];

  // selectedCompanyName = '';
  // selectedCompanyCode = '';
  // selectedId = '';

  selectedCompany: Promotion = {
    promotion_target: '',
    promotion_target_company: '',
    idx: ''
  };

  constructor(
    public dialog: MatDialog,
    private deviceService: DeviceService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    // TODO: 공시 지원금 분리 해주자
    this.getCompanyList();    // 업체 리스트
    this.getPayPlanList();    // 요금제 리스트
    // 단말기 선택 시 모든 요금제를 보여 줘야 한다.
    this.getPhoneList();      // 전화기 리스트
    
  }

  ngOnDestroy(): void {
    this.promoCompanySub?.unsubscribe();
    this.supportDeviceSub?.unsubscribe();
    this.phoneListSub?.unsubscribe();
    this.payPlanListSub?.unsubscribe();
  }

//#region 행사 업체 관련 펑션
  // 행사 업체의 단말기 리스트 가져오기
  btnSearchCompany(): void {
    this.supportDeviceSub?.unsubscribe();

    this.supportDeviceSub = this.deviceService.getPromotion('Promotion').doc(this.selectedCompany.idx)
      .collection('support_device').valueChanges({ idField: 'idx' }).pipe().subscribe((ref2: any[]) => {

        const tempList = ref2;
        //console.log(ref2);

        ref2.sort((a,b) => {
          if(a.deviceName === b.deviceName)
          {
            return a.sktNetType > b.sktNetType ? 1 : -1;
          }
          return a.deviceName > b.deviceName ? 1 : -1;
        });
        //let sortedList = this.uniqueBy(tempList.map( data => data.deviceName), JSON.stringify);

        this.promotionDeviceDataSource = ref2;
        //console.log('promotion device list', tempList, ref2);
      });
  }

  // 행사 업체 추가
  btnAddPromotion(): void {
    const dialogRef = this.dialog.open(PromoDetailInsertComponent, {
      data: {
        width: '400px', type: 'promo',
        id: this.selectedCompany.idx,
        company: this.selectedCompany.promotion_target_company,
        code: this.selectedCompany.promotion_target
      }
    });
    dialogRef.afterClosed().subscribe((result: PromotionDialogResult) => {
      if (result.code === 0) {
        alert('저장 성공');
      }
      else if (result.code === 99) {
        alert(result.message);
      }
    });
  }
//#endregion

  //#region 단말기 추가/수정/삭제
  // 장치 추가
  btnAddDevice(): void {
    if (this.selectedCompany.idx.length === 0) {
      alert('업체를 선택 해 주세요');
      return;
    }

    // TODO: 행사 단말기 정보를 넘겨 주자
    const dialogRef = this.dialog.open(PromoDetailComponent, {
      data: {
        width: '400px',
        type: 'device',
        id: this.selectedCompany.idx,
        company: this.selectedCompany.promotion_target_company,
        code: this.selectedCompany.promotion_target,
        phoneList: this.phoneList,
        planGroup: this.planGroupData
      }
    });
    dialogRef.afterClosed().subscribe((result: PromotionDialogResult) => {
      if (result.code === 0) {
        alert('저장 성공');
      }
      else if (result.code === 99) {
        alert(result.message);
      }
    });
  }

  // 장치 삭제
  promo_item_delete(data): void {

    const temp = this.deviceService.getPromotion('Promotion').doc(this.selectedCompany.idx)
      .collection('support_device').doc(data.idx).delete()
      .then(result => console.log('success'))
      .catch(err => console.log(err));
  }
  //#endregion 단말기 추가/수정/삭제

  //#region 기본 정보 전체 단말기 리스트 / 전체 요금제 정보
  getCompanyList(): void {
    this.promoCompanySub = this.deviceService.getPromotion('Promotion')
      .snapshotChanges()
      .pipe(map((result: any) => {
        return result.map(resultData => {
          const idx = resultData.payload.doc.id;
          const data = resultData.payload.doc.data();

          return { idx, ...data };
        });
      }))
      .subscribe((ref: Promotion[]) => {
        this.promotionDataSource = ref;
      });
  }
  // 등록 된 모든 단말기의 정보를 가져와야 함
  getPhoneList(): void {
    this.phoneListSub = this.firestore.collection('Phone').stateChanges()
      .pipe(take(1), map(result => {
        return result.map((resultData: any) => {
          const idx = resultData.payload.doc.id;
          const data = resultData.payload.doc.data();

          return { idx, ...data };
        });
      })).subscribe((ref: Array<PHONE_DETAIL>) => {
        // console.log('phone list = ', ref);
        // console.log('요금제 리스트 = ', this.planGroupData);
        this.phoneList = ref;
      });
  }
  // 등록 된 모든 요금제를 가져온다.
  getPayPlanList(): void {

    this.payPlanListSub = this.firestore.collection('PayPlan')
      .stateChanges().pipe(take(1), map(result => {
        return result.map((resultData: any) => {
          const idx = resultData.payload.doc.id;
          const data = resultData.payload.doc.data();

          return { idx, ...data };
        });
      })).subscribe(ref => {
        // 내림차순 정렬
        const sortedList = ref.sort((a, b) =>
          a.monthPay > b.monthPay ? -1 : 1
        );
        // 그루핑
        const groups = this.uniqueBy(ref.map(netkind => netkind.netKind), JSON.stringify);

        // 그룹 버퍼를 생성
        groups.forEach(item => {
          let temp: PlanDataGroup;
          temp = { name: item, value: [] };
          this.planGroupData.push(temp);
        });
        // 그룹 버퍼에 데이터 삽입
        ref.forEach(recvData => {
          this.planGroupData.forEach(g => {
            if (g.name === recvData.netKind) {
              g.value.push(recvData);
            }
          });
        });
      });

  }
  //#endregion

  uniqueBy(a, key): any {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }
}
