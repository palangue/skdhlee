import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeviceService } from '../../device.service';
import { PromotionDialogResult, PromoSupportDialogData } from '../../../models/Promotion';
import { map, take } from 'rxjs/operators';
import { PHONE_DETAIL } from 'src/models/PhoneDetail';
import { PlanDataGroup } from 'src/models/PaymentPlan';
import { PromoDetailComponent } from '../promo-detail/promo-detail.component';




@Component({
  selector: 'app-promo-detail-insert',
  templateUrl: './promo-detail-insert.component.html',
  styleUrls: ['./promo-detail-insert.component.css']
})
export class PromoDetailInsertComponent implements OnInit {

  typePromo = false;
  index = '';

  //supportDevice: Array<SupportPromotionDevice>;
  supportDevice: Array<any>;

  promotionGroup: FormGroup;
  deviceGroup: FormGroup;
  planGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PromoSupportDialogData,
    private _formGroup: FormBuilder,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<PromoDetailComponent>,

  ) {
    if (data.type === 'promo') {
      this.typePromo = true;
    }
    this.index = data.id;

    console.log('index = ', this.index);
  }

  ngOnInit(): void {

    // 프로모션으로 진입 시 초기화
    this.promotionGroup = this._formGroup.group({
      company_name_ctrl: ['', Validators.required],
      company_code_ctrl: ['', Validators.required],
      promo_cost_ctrl: ['', Validators.required],
    });

  }


  ngOnDestroy(): void {
  }

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


}







