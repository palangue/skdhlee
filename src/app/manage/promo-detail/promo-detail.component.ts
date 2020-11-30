import { Component, Inject, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../device.service';
import { Promotion, SupportPromotionDevice, PromotionDialogResult } from '../../../models/Promotion'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  width: string;
  type: string;
  company: string;
  code: string;
  id: string;
}

@Component({
  selector: 'app-promo-detail',
  templateUrl: './promo-detail.component.html',
  styleUrls: ['./promo-detail.component.css']
})
export class PromoDetailComponent implements OnInit, OnDestroy {

  typeDevice = false;
  typePromo = false;
  index = '';

  // tslint:disable-next-line: variable-name
  promo_company: string;
  // tslint:disable-next-line: variable-name
  promo_code: string;
  // tslint:disable-next-line: variable-name
  bizone_price: number;
  // tslint:disable-next-line: variable-name
  date_start: number;
  // tslint:disable-next-line: variable-name
  date_end: number;

  supportDevice: Array<SupportPromotionDevice>;

  promotionGroup: FormGroup;
  deviceGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    // tslint:disable-next-line: variable-name
    private _formGroup: FormBuilder,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<PromoDetailComponent>,

  ) {
    if (data.type === 'device') {
      this.typeDevice = true;
    }

    if (data.type === 'promo') {
      this.typePromo = true;
    }
    this.index = data.id;
  }

  ngOnInit(): void {

    this.promotionGroup = this._formGroup.group({
      company_name_ctrl: ['', Validators.required],
      company_code_ctrl: ['', Validators.required],
      promo_cost_ctrl: ['', Validators.required],

    });
    this.deviceGroup = this._formGroup.group({
      device_name_ctrl: ['', Validators.required],
      device_price_ctrl: ['', Validators.required]
    });
  }
  ngOnDestroy(): void {

  }
  //#region 버튼 액션
  // 행사 단말기 추가
  addPromotion(): void {
    const data = {
      promotion_target: this.promotionGroup.get('company_code_ctrl').value,
      promotion_target_company: this.promotionGroup.get('company_name_ctrl').value,
    };

    if (data.promotion_target.length === 0 || data.promotion_target_company.length === 0) {
      alert('입력 값이 없습니다');
      return;
    }

    this.deviceService
      .getPromotionDb()
      .add(data)
      .then(() => {
        const dialogResult: PromotionDialogResult = {
          code: 0,
          message: '성공'
        };
        this.dialogRef.close(dialogResult);
      })
      .catch((err) => {
        const dialogResult: PromotionDialogResult = {
          code: 99,
          message: err
        };
        this.dialogRef.close(dialogResult);
      });
  }
  // 취소
  cancel(): void {
    this.dialogRef.close({ code: -1, message: '' });
  }
  //#endregion
  addDevice(): void {
    const data = {
      deviceName: this.deviceGroup.get('device_name_ctrl').value,
      devicePrice: this.deviceGroup.get('device_price_ctrl').value
    };
    if (data.deviceName.length === 0 || data.devicePrice === 0) {
      alert('입력한 데이터가 없습니다');
      return;
    }
    this.deviceService.getPromotionDb()
      .doc(this.index)
      .collection('support_device')
      .add(data)
      .then(() => {
        const msgData: PromotionDialogResult = {
          code: 0,
          message: '성공'
        };

        this.dialogRef.close(msgData);
      })
      .catch((err) => {
        const msgData: PromotionDialogResult = {
          code: 99,
          message: err
        };

        this.dialogRef.close(msgData);
      });
  }
}