import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';

import { DeviceService } from '../../device.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { OrderService } from '../../order.service';
import { IPaymentPlan } from '../../../models/PaymentPlan';


@Component({
  selector: 'app-order-phone',
  templateUrl: './order-phone.component.html',
  styleUrls: ['./order-phone.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})

export class OrderPhoneComponent implements OnInit, OnDestroy {

  public selectedPhoneInfo: any;// PHONE_DETAIL;

  customer_name: string;
  customer_phone_number: string;

  selectedSupportMoney = 0;

  promo_code: string;

  //#region local variable
  selectedPhoneName: string;
  selectedMasterPlan: string;
  selectedStorage: number;
  selectedColor: string;
  selectedAgreement: string;
  selectedPayPlan: string;
  selectedDeviceInstallment: number;
  //#endregion

  //#region stepper Label variable
  titleCustInfo = '고객님 연락처';
  titleMasterPlan = '가입방법';
  titleDeviceInfo = '단말기 색상 선택';
  titleAgreementInfo = '할인 방법을 선택 해 주세요';
  titlePayPlan = '통신 요금제 선택';
  titleDeviceInstallmentInfo = '단말기 할부 선택';
  //#endregion

  //#region Form Group
  masterplanFormGroup: FormGroup;        // 신규, 기변, 번이
  customerFormGroup: FormGroup;          // 고객정보 폼
  deviceFormGroup: FormGroup;            // 장치 선택 폼
  deviceInstallmentFormGroup: FormGroup; // 단말기 요금 납부 방법
  payplanFormGroup: FormGroup;           // 요금제 선택 폼
  agreementFormGroup: FormGroup;         // 할부 개월 선택 폼
  //#endregion

  //#region Monitoring Data
  plan_sub: Subscription;
  promo_plan: IPaymentPlan[];
  //#endregion

  @Input() deviceInfo: PHONE_DETAIL;

  constructor(
    private deviceService: DeviceService,
    private _formBuilder: FormBuilder,
    private orderService: OrderService
  ) {

  }

  ngOnInit(): void {

    //#region 폼 그룹
    this.masterplanFormGroup = this._formBuilder.group({
      registerCtrl: ['', Validators.required]
    });

    this.customerFormGroup = this._formBuilder.group({
      customer_name_ctrl: ['', Validators.required],
      customer_phone_ctrl: ['', Validators.required]
    });
    this.deviceFormGroup = this._formBuilder.group({
      // device_storage_ctrl: ['', Validators.required],
      device_color_ctrl: ['', Validators.required]
    });
    this.payplanFormGroup = this._formBuilder.group({
      payplan_ctrl: ['', Validators.required]
    });
    this.agreementFormGroup = this._formBuilder.group({
      agreement_ctrl: ['', Validators.required]
    });
    this.deviceInstallmentFormGroup = this._formBuilder.group({
      deviceInstallmentCtrl: ['', Validators.required]
    })

    //#endregion

    // 선택한 장치 정보
    this.selectedPhoneInfo = this.orderService.getSelectedPhone();
    // 로그인 된 프로모션 코드
    this.promo_code = this.deviceService.getUserPromoCode();
    // 장치 리스트
    // if (this.plan_sub) { this.plan_sub.unsubscribe(); }
    // this.plan_sub = this.orderService.getPayPlan().pipe(take(1)).subscribe((data) => {
    //   this.promo_plan = data;
    // });
    // 요금제 리스트
    console.log(this.selectedPhoneInfo.plans);
  }

  ngOnDestroy(): void {
    if (this.plan_sub) { this.plan_sub.unsubscribe(); }
  }

  //#region Set Selection to Stepper Title
  customerInfo(): void {
    this.customer_name = this.customerFormGroup.get('customer_name_ctrl').value;
    this.customer_phone_number = this.customerFormGroup.get('customer_phone_ctrl').value;
    if (this.customer_name && this.customer_phone_number) {
      this.titleCustInfo = '안녕하세요. ' + this.customer_name + ' 님';
    }
  }
  chooseRegisterPlan(): void {
    this.selectedMasterPlan = this.masterplanFormGroup.get('registerCtrl').value;
    if (this.selectedMasterPlan) {
      this.titleMasterPlan = this.selectedMasterPlan;
    }
  }
  // 단말기 사양 선택
  chooseDevice(): void {
    // this.selectedStorage = this.deviceFormGroup.get('device_storage_ctrl').value;
    this.selectedStorage = this.selectedPhoneInfo.storageSize;

    this.selectedColor = this.deviceFormGroup.get('device_color_ctrl').value;
    if (this.selectedStorage && this.selectedColor) {
      this.titleDeviceInfo = this.selectedStorage + ' G,  ' + this.selectedColor;
    }
  }
  // 약정 선택 : 공시지원금, 선택 약정 25%
  chooseAgreement(): void {
    this.selectedAgreement = this.agreementFormGroup.get('agreement_ctrl').value;

    if (this.selectedAgreement) {
      if (this.selectedAgreement === '공시지원금') {
        this.titleAgreementInfo = this.selectedAgreement + '으로 단말기 가격 할인을 받습니다';
      }
      else {
        this.titleAgreementInfo = '선택약정으로' + this.selectedAgreement + '개월간 25% 통신 요금 할인을 받습니다';
      }
    }
  }
  // 단말기 할부 개월
  chooseDeviceInstallment(): void {
    this.selectedDeviceInstallment = this.deviceInstallmentFormGroup.get('deviceInstallmentCtrl').value;

    if (this.selectedDeviceInstallment) {
      if (this.selectedDeviceInstallment == 0) {
        this.titleDeviceInstallmentInfo = '일시불로 단말기 요금 납부';
      }
      else {
        this.titleDeviceInstallmentInfo = this.selectedDeviceInstallment + ' 개월 단말기 요금 할부';
      }
    }

  }
  // 통신 요금 납부 개월 ( 이거 안씀 )
  choosePayPlan(): void {
    this.selectedPayPlan = this.payplanFormGroup.get('payplan_ctrl').value;

    if (this.selectedPayPlan) {
      this.titlePayPlan = this.selectedPayPlan + ' 요금제';
    }
  }
  // 2021.01.19 통신 요금에 따른 복지 할인 금액 가져오기
  getSupportMoney(planInfo: any): number {

    // TODO: 이 부분이 꼭 필요한지 확인 필수
    switch (this.titleMasterPlan) {
      case '신규가입':
        return planInfo.newDevice;
      case '기기변경':
        return planInfo.changeDevice;
      case '번호이동':
        return planInfo.moveNumber;
    }
  }
  // 2021.01.19 통신 요금제 선택에 따른 공시지원금 출력
  getPublicPrice(): string {

    if (this.titlePayPlan !== '통신 요금제 선택') {
      for (let item of this.selectedPhoneInfo.plans) {
        const temp = this.titlePayPlan.indexOf(item.planName);

        if (temp >= 0) {
          return item.publicPrice;
        }
      }
    }

    return '';
  }
  //#endregion

  //#region Sync data subscription
  setPayPlan(planData: any): void {
    console.log('footer 쪽으로 데이터 pushing 하고 있네');
    switch (this.titleMasterPlan) {
      case '신규가입':
        this.selectedSupportMoney  = planData.newDevice;
        break;
      case '기기변경':
        this.selectedSupportMoney  = planData.changeDevice;
        break;
      case '번호이동':
        this.selectedSupportMoney  = planData.moveNumber;
        break;
    }
    this.orderService.sendPricing(planData);
    this.orderService.sendSupportMoney(this.selectedSupportMoney);
  }
  // 공시지원금, 선택약정
  setInstallment(installment: string): void {
    switch (installment) {
      case '공시지원금':
        this.orderService.sendInstallment(Number(this.getPublicPrice()));
        break;
      case '선택약정 12개월':
        this.orderService.sendInstallment(12);
        break;
      case '선택약정 24개월':
        this.orderService.sendInstallment(24);
        break;
    }

  }
  // 단말기 할부 개월 수
  setDeviceInstallment(installment: number): void{
    this.orderService.sendDeviceInstallment(installment);
  }
  //#endregion


}
