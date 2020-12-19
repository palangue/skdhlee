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
  promotionDeviceColumns: string[] = ['name', 'publicPrice', 'choosePrice', 'promotion_actions'];
  promotionDeviceDataSource: SupportPromotionDevice[];

  promoCompanySub: Subscription;
  supportDeviceSub: Subscription;
  phoneListSub: Subscription;
  payPlanSub: Subscription;

  // 단말기 리스트
  phoneList: Array<PHONE_DETAIL>;
  // 요금제 리스트
  payPlanList: Array<IPayPlan>;
  // 통신망 별 요금제 리스트 그룹
  planGroupData: Array<PlanDataGroup> = [];

  selectedCompanyName = '';
  selectedCompanyCode = '';
  selectedId = '';

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
    this.getCompanyList();
    this.getPhoneList();
    this.getPayPlanList();
  }

  ngOnDestroy(): void {
    if (this.promoCompanySub) {
      this.promoCompanySub.unsubscribe();
    }
    if (this.supportDeviceSub) {
      this.supportDeviceSub.unsubscribe();
    }
    if (this.phoneListSub) {
      this.phoneListSub.unsubscribe();
    }
  }


  btnSelectCompany(index: string, promoTargetCode: string, promoTargetName): void {
    this.selectedCompanyCode = promoTargetCode;
    this.selectedCompanyName = promoTargetName;
    this.selectedId = index;

    if (this.supportDeviceSub) {
      this.supportDeviceSub.unsubscribe();
    }
    this.supportDeviceSub = this.deviceService.getPromotion('Promotion').doc(this.selectedId)
      .collection('support_device').valueChanges({ idField: 'idx' }).pipe().subscribe((ref2: SupportPromotionDevice[]) => {
        this.promotionDeviceDataSource = ref2;
        console.log('update supportDevice', this.promotionDeviceDataSource);
      });
  }
  btnSearchCompany(){
    // this.selectedCompany.idx;
    // this.selectedCompany.promotion_target;
    // this.selectedCompany.promotion_target_company;

    if (this.supportDeviceSub) {
      this.supportDeviceSub.unsubscribe();
    }
    this.supportDeviceSub = this.deviceService.getPromotion('Promotion').doc(this.selectedCompany.idx)
      .collection('support_device').valueChanges({ idField: 'idx' }).pipe().subscribe((ref2: SupportPromotionDevice[]) => {
        this.promotionDeviceDataSource = ref2;
      });
  }
  //#region 행사 추가 다이얼로그
  // 행사 업체 추가
  btnAddPromotion(): void {
    const dialogRef = this.dialog.open(PromoDetailComponent, {
      data: { width: '400px', type: 'promo', id: this.selectedId, company: this.selectedCompanyName, code: this.selectedCompanyCode }
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
    if (this.selectedId.length === 0) {
      alert('업체를 선택 해 주세요');
      return;
    }

    // TODO: 행사 단말기 정보를 넘겨 주자
    const dialogRef = this.dialog.open(PromoDetailComponent, {
      data: {
        width: '400px',
        type: 'device',
        id: this.selectedId,
        company: this.selectedCompanyName,
        code: this.selectedCompanyCode,
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
  // 장치 수정
  promo_item_modify(data, data2): void {
    if (this.selectedId.length === 0) {
      alert('업체를 선택 해 주세요');
      return;
    }

    const dialogRef = this.dialog.open(PromoDetailComponent, {
      data: {
        width: '400px',
        type: 'device',
        id: this.selectedId,
        company: this.selectedCompanyName,
        code: this.selectedCompanyCode,
        supportDeviceData: data,
        phoneList: this.phoneList
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

    const temp = this.deviceService.getPromotion('Promotion').doc(this.selectedId)
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
    this.phoneListSub = this.firestore.collection('Phone').stateChanges().pipe(take(1), map(result => {
      return result.map((resultData: any) => {
        const idx = resultData.payload.doc.id;
        const data = resultData.payload.doc.data();

        return { idx, ...data };
      });
    })).subscribe((ref: Array<PHONE_DETAIL>) => {
      this.phoneList = ref;
    });
  }
  // 등록 된 모든 요금제를 가져온다.
  getPayPlanList(): void {

    this.firestore.collection('PayPlan')
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

        console.log(this.planGroupData);

        for (const i of this.planGroupData) {
          console.log('Plan_Name = ', i.name);
        }
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
