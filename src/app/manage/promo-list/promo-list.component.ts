import { PromoSupportDialogData } from './../promo-detail/promo-detail.component';
import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeviceService } from '../../device.service';
import { PromoDetailComponent } from '../promo-detail/promo-detail.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SupportPromotionDevice, Promotion, PromotionDialogResult } from '../../../models/Promotion'


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
  selectedCompanyName = '';
  selectedCompanyCode = '';
  selectedId = '';

  constructor(
    public dialog: MatDialog,
    private deviceService: DeviceService
  ) { }

  ngOnInit(): void {
    this.promoCompanySub = this.deviceService.getPromotion('Promotion')
      .valueChanges({ idField: 'idx' })
      .pipe()
      .subscribe((ref: Promotion[]) => {
        this.promotionDataSource = ref;
      });
  }

  ngOnDestroy(): void {
    if (this.promoCompanySub) {
      console.log('promo-list.component promoCompanySub destroyed');
      this.promoCompanySub.unsubscribe();
    }
    if (this.supportDeviceSub) {
      console.log('promo-list.component supportDeviceSub destroyed');
      this.supportDeviceSub.unsubscribe();
    }
  }


  btnSelectCompany(index: string, promoTargetCode: string, promoTargetName): void {
    this.selectedCompanyCode = promoTargetCode;
    this.selectedCompanyName = promoTargetName;
    this.selectedId = index;

    if (this.supportDeviceSub) {
      console.log('re allocate supportDeviceSub');
      this.supportDeviceSub.unsubscribe();
    }
    this.supportDeviceSub = this.deviceService.getPromotion('Promotion').doc(this.selectedId)
      .collection('support_device').valueChanges({ idField: 'idx' }).pipe().subscribe((ref2: SupportPromotionDevice[]) => {
        this.promotionDeviceDataSource = ref2;
        console.log('update supportDevice', this.promotionDeviceDataSource);
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
  // 장치 추가
  btnAddDevice(): void {
    console.log(this.selectedId);
    if (this.selectedId.length === 0) {
      alert('업체를 선택 해 주세요');
      return;
    }

    // TODO: 행사 단말기 정보를 넘겨 주자
    const dialogRef = this.dialog.open(PromoDetailComponent, {

      data: { width: '400px', type: 'device', id: this.selectedId, company: this.selectedCompanyName, code: this.selectedCompanyCode }
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

  promo_item_modify(data, data2): void {
    console.log(data, data2);

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
        supportDeviceData: data
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


    // TODO: 행사 단말기 수정
    // const temp = this.deviceService.getPromotion('Promotion').doc(this.selectedId)
    //   .collection('support_device').doc(data.idx)
    //   .update({ publicPrice: data.publicPrice, deviceName: data.deviceName, choosePrice: data.choosePrice })
    //   .then(result => console.log('success'))
    //   .catch(err => console.log('error'));
  }
  promo_item_delete(data): void {

    const temp = this.deviceService.getPromotion('Promotion').doc(this.selectedId)
      .collection('support_device').doc(data.idx).delete()
      .then(result => console.log('success'))
      .catch(err => console.log(err));
  }
}
