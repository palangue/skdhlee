import { Component, Inject, OnInit, ɵConsole } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../device.service';
import { Promotion, SupportPromotionDevice } from '../../../models/Promotion'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-promo-detail',
  templateUrl: './promo-detail.component.html',
  styleUrls: ['./promo-detail.component.css']
})
export class PromoDetailComponent implements OnInit {

  promo_company : string;
  promo_code : string;
  bizone_price : number;
  date_start : number;
  date_end : number;

  supportDevice : Array<SupportPromotionDevice>;

  promotion_group : FormGroup;  

  constructor(private _formGroup : FormBuilder,
    private deviceService : DeviceService,
    private dialogRef : MatDialogRef<PromoDetailComponent>,
    ) { 
  }

  ngOnInit(): void {
    this.promotion_group = this._formGroup.group({
      company_name_ctrl : ['', Validators.required],
      company_code_ctrl : ['', Validators.required],
      promo_cost_ctrl : ['', Validators.required],
      
    })
  }

  //#region 시작일 종료일
  startDateChange(event : Date){
    this.date_start = event.getTime();
  }
  endDateChange(event : Date){
    this.date_end = event.getTime();
  }
  //#endregion

  //#region 버튼 액션
  // 행사 추가
  addPromotion(){

    var temp = this.promotion_group.get('company_code_ctrl').value;
    var temp2  = this.promotion_group.get('company_name_ctrl').value;

    var data : Promotion = {
      promotion_target : this.promotion_group.get('company_code_ctrl').value,
      promotion_target_company : this.promotion_group.get('company_name_ctrl').value,
      bizone_price : this.promotion_group.get('promo_cost_ctrl').value,
      date_start : this.date_start,
      date_end : this.date_end,
      support : this.supportDevice,
      idx : null
    };

    var addResult = this.deviceService.addPromotion(data);

    console.log(addResult);

    this.dialogRef.close(true);
  }
  //취소
  cancel(){
    this.dialogRef.close(false);
  }
  //#endregion
}
