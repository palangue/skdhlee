import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DeviceService } from '../../device.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { OrderService } from '../../order.service';
import { IPaymentPlan } from '../../../models/PaymentPlan';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { map,take } from 'rxjs/operators';

@Component({
  selector: 'app-order-phone',
  templateUrl: './order-phone.component.html',
  styleUrls: ['./order-phone.component.css'],
  providers : [{
    provide : STEPPER_GLOBAL_OPTIONS, useValue : { showError : true }
  }]
})

export class OrderPhoneComponent implements OnInit,OnDestroy, AfterViewInit {
  
  public selectedPhoneInfo : PHONE_DETAIL;

  customer_name : string;
  customer_phone_number : string;
  
  promo_code : string;

  //#region local variable
  selectedPhoneName : string;
  selectedStorage : number;
  selectedColor : string;
  selectedAgreement : string;
  selectedPayPlan : string;
  selectedDeviceInstallment : number;
  //#endregion

  //#region stepper Label variable
  titleCustInfo : string = '고객님 연락처';
  titleDeviceInfo : string = '사양 선택';
  titleAgreementInfo : string = '통신 요금 약정 선택';
  titlePayPlan : string = '통신 요금제 선택';
  titleDeviceInstallmentInfo : string = "단말기 할부 선택";
  //#endregion

  //#region Form Group
  masterplanFormGroup : FormGroup;        // 신규, 기변, 번이
  customerFormGroup : FormGroup;          // 고객정보 폼
  deviceFormGroup : FormGroup;            // 장치 선택 폼
  deviceInstallmentFormGroup : FormGroup; // 단말기 요금 납부 방법
  payplanFormGroup : FormGroup;           // 요금제 선택 폼
  agreementFormGroup : FormGroup;         // 할부 개월 선택 폼
  //#endregion

  //#region Monitoring Data
  plan_sub : Subscription;
  promo_plan : IPaymentPlan[];
  //#endregion

  @Input() deviceInfo : PHONE_DETAIL;

  constructor(
    private deviceService : DeviceService,
    private _formBuilder : FormBuilder,
    private orderService : OrderService
  ) { 

  }

  ngOnInit(): void {
    
    //#region 폼 그룹
    this.masterplanFormGroup = this._formBuilder.group({
      registerCtrl : [ '', Validators.required]
    })

    this.customerFormGroup = this._formBuilder.group({
      customer_name_ctrl : [ '' , Validators.required],
      customer_phone_ctrl : ['', Validators.required]
    });
    this.deviceFormGroup = this._formBuilder.group({
      device_storage_ctrl : [ '', Validators.required],
      device_color_ctrl : ['', Validators.required]
    });
    this.payplanFormGroup = this._formBuilder.group({
      payplan_ctrl : ['', Validators.required]
    });
    this.agreementFormGroup = this._formBuilder.group({
      agreement_ctrl : ['', Validators.required]
    });
    this.deviceInstallmentFormGroup = this._formBuilder.group({
      deviceInstallmentCtrl : ['', Validators.required]
    })
    
    //#endregion
    
    // 선택한 장치 정보
    this.selectedPhoneInfo = this.orderService.getSelectedPhone();
    // 로그인 된 프로모션 코드
    this.promo_code = this.deviceService.getUserPromoCode();
    // 장치 리스트
    if(this.plan_sub) this.plan_sub.unsubscribe();
    this.plan_sub = this.orderService.getPayPlan().pipe(take(1)).subscribe( (data) => {
      this.promo_plan = data;
    });
    
  }
  ngAfterViewInit(){
    
  }
  ngOnDestroy(){
    if(this.plan_sub) this.plan_sub.unsubscribe();
  }

  //#region Set Selection to Stepper Title
  customerInfo(){
    this.customer_name = this.customerFormGroup.get('customer_name_ctrl').value;
    this.customer_phone_number = this.customerFormGroup.get('customer_phone_ctrl').value;
    if(this.customer_name && this.customer_phone_number)
      this.titleCustInfo = '안녕하세요. ' + this.customer_name + ' 님';
  }
  // 단말기 사양 선택
  chooseDevice(){
    this.selectedStorage = this.deviceFormGroup.get('device_storage_ctrl').value;
    this.selectedColor = this.deviceFormGroup.get('device_color_ctrl').value;
    if( this.selectedStorage && this.selectedColor)
      this.titleDeviceInfo = this.selectedStorage + ' G,  ' + this.selectedColor;
  }
  // 약정 선택 : 공시지원금, 선택 약정 25%
  chooseAgreement(){
    this.selectedAgreement = this.agreementFormGroup.get('agreement_ctrl').value;

    if(this.selectedAgreement)
    {
      if ( this.selectedAgreement === '공시지원금'){
        this.titleAgreementInfo = this.selectedAgreement + '으로 단말기 가격 할인';
      }
      else{
        this.titleAgreementInfo = this.selectedAgreement + '로 25% 통신 요금 할인';
      }
    }
  }
  // 단말기 할부 개월
  chooseDeviceInstallment(){
    this.selectedDeviceInstallment = this.deviceInstallmentFormGroup.get('deviceInstallmentCtrl').value;

    if(this.selectedDeviceInstallment)
    {
      if(this.selectedDeviceInstallment == 0 ){
        this.titleDeviceInstallmentInfo = '일시불로 단말기 요금 납부';
      }
      else{
        this.titleDeviceInstallmentInfo = this.selectedDeviceInstallment + ' 개월 단말기 요금 할부';
      }
    }
      
  }
  // 통신 요금 납부 개월
  choosePayPlan(){
    this.selectedPayPlan = this.payplanFormGroup.get('payplan_ctrl').value;

    if(this.selectedPayPlan)
      this.titlePayPlan = this.selectedPayPlan + " 요금제";
  }
  //#endregion
  
  //#region Sync data subscription
  setPayPlan(planData : IPaymentPlan){
    this.orderService.sendPricing(planData);
  }
  setInstallment(installment : string){
    this.orderService.sendInstallment(installment);
  }
  //#endregion


}
