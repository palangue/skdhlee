import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { OrderService } from '../..//order.service';
import { DeviceService } from '../../device.service';
import { ICustomer } from '../../../models/Customer';


@Component({
  selector: 'app-order-footer',
  templateUrl: './order-footer.component.html',
  styleUrls: ['./order-footer.component.css']
})
export class OrderFooterComponent implements OnInit, OnDestroy {

  @Input() originPrice: number;

  deviceInstallment: number = 1;  // 단말기 할부 개월 수
  monthPayAmount: number = 0;

  installmentType: number = 0;  // 공시지원금, 12개월, 24개월
  supportMoney: number = 0;     // 복지 지원금 금액
  publicPrice: number = 0;      // 공시지원금 ( 선택 약정시 0 원 )
  discountMonth: number = 0;    // 선택약정 개월 수 ( 공시지원금 선택 시 0 )
  discountPercent = 1.0;        // 선택 약정 시 할인 율 (1.0)

  calculatedDeviceMonthPay = 0; // 계산 된 월 단말기 할부 요금
  calculatedMonthPay = 0;       // 계산 된 월 통신 요금

  pricing_subscription: Subscription;
  installment_subscription: Subscription;
  supportMoneySubscription: Subscription;
  deviceInstallmentSubscription: Subscription;

  constructor(private deviceService: DeviceService,
    private orderService: OrderService,
    ) {

  }

  ngOnInit(): void {
    // 월 통신요금 동기화
    this.pricing_subscription = this.orderService.getPricingObserv().subscribe(
      (ref: any) => {
        this.monthPayAmount = ref.monthPay
      }
    );
    // 선택약정, 공시지원
    // 공시지원 : 공시지원 금액을 받는다.
    // 선택 약정 : 개월 수를 받는다. 12개월 24개월 모두 25% 할인 설정을 한다.
    this.installment_subscription = this.orderService.getInstallmentObserv().subscribe(
      (ref: number) => {
        if (ref === 24 || ref === 12) {
          console.log("선택약정으로 체크 됨");
          this.publicPrice = 0;
          this.discountMonth = ref;
          this.discountPercent = 0.25;
        }
        else {
          console.log("공시지원으로 체크 됨");
          this.publicPrice = ref;
          this.discountMonth = 0;
          this.discountPercent = 1.0;
        }
      }
    )
    this.supportMoneySubscription = this.orderService.getSupportMoneyObserv().subscribe(
      (ref: number) => {
        console.log(ref);
        this.supportMoney = ref;
      }
    );
    this.deviceInstallmentSubscription = this.orderService.getDeviceInstallment().subscribe(
      (ref: number) => {
        console.log(ref);
        this.deviceInstallment = ref;
      }
    )
  }
  ngOnDestroy(): void {
    this.pricing_subscription?.unsubscribe();
    this.installment_subscription?.unsubscribe();
    this.installment_subscription?.unsubscribe();
    this.deviceInstallmentSubscription?.unsubscribe();
  }

  // 월 단말기 할부 요금 계산
  getMonthPayOfDeviceInstallment(): number {
    const minusAmount = (this.originPrice - this.supportMoney - this.publicPrice);
    const monthDevicePay = minusAmount / this.deviceInstallment;

    if (this.deviceInstallment === 1) this.calculatedDeviceMonthPay = monthDevicePay;
    else this.calculatedDeviceMonthPay = monthDevicePay + (monthDevicePay * 0.059);

    if (this.calculatedDeviceMonthPay < 0) this.calculatedDeviceMonthPay = 0;
    return this.calculatedDeviceMonthPay;
  }

  // 월 통신 요금 계산
  getMonthPlanAmount(): number {
    const monthAmount = this.monthPayAmount * this.discountPercent;

    if (this.discountPercent === 1) this.calculatedMonthPay = this.monthPayAmount;
    else this.calculatedMonthPay = this.monthPayAmount - monthAmount;

    return (this.calculatedMonthPay);
  }

  // 월 요금 합산. 월 단말기 할부금 + 월 툥신 요금
  getTotalMonthPay(): number {
    return Number(this.calculatedDeviceMonthPay) + Number(this.calculatedMonthPay);
  }

  savePhoneDetail(): void {
    alert(Date.now().toString());
    let orderInfo: ICustomer = {
      customer_mobile : '',
      customer_name : '',
      device_color : '',
      device_name : '',
      device_storage : '',
      installment_plan: '',
      isDone: false,
      promo_company: '',
      promo_name: '',
      submitData: '',
      masterPlan: '',
      payPlan:'',
    };

  }
}
