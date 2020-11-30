import { componentFactoryName } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OrderService } from '../..//order.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { DeviceService } from '../../device.service';
import { IPaymentPlan } from '../../../models/PaymentPlan';

@Component({
  selector: 'app-order-footer',
  templateUrl: './order-footer.component.html',
  styleUrls: ['./order-footer.component.css']
})
export class OrderFooterComponent implements OnInit, OnDestroy {

  device_installment: number = 0;
  using_pay: number = 0;

  installment: string = '';

  pricing_subscription: Subscription;
  installment_subscription: Subscription;

  constructor(private deviceService: DeviceService,
    private orderService: OrderService,
    private orderDialog: MatDialog) {

  }

  ngOnInit(): void {
    // 통신요금 동기화
    this.pricing_subscription = this.orderService.getPricingObserv().subscribe(
      (ref: IPaymentPlan) => {
        console.log(ref.month_discount);
        this.device_installment = ref.month_discount;
        this.using_pay = ref.month_pay_after_discount
      }
    );
    // 통신요금 할부 개월 동기화
    this.installment_subscription = this.orderService.getInstallmentObserv().subscribe(
      (ref: string) => {
        this.installment = ref;
      }
    )
  }
  ngOnDestroy(): void {
    if (this.pricing_subscription)
      this.pricing_subscription.unsubscribe();
  }
  phoneCall() {
    alert('전화 상담 클릭 했다');
    // const phoneCallDialogRef = this.dialog.open(PhoneCallDialog);
    // phoneCallDialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  }

  RequestOrder() {
    // const dialogRef = this.orderDialog.open(DialogOverViewDialog,{
    //   width : '80%',
    //   data : {
    //     name : 'abc',
    //     spec : "no_spec"
    //   }
    // });
    // dialogRef.afterClosed().subscribe(ref => {
    //   console.log(ref);
    //   // ref 값이 성공이면
    //   // 구매 신청이 완료 되었습니다. 접수 확인 후 연락 드리겠습니다. 감사합니다. ( Redirect 필요하겠네 )
    //   // ref 값이 실패이면
    //   // 현재 페이지에 머물거나 전화 상담 요청으로 거거
    // })
  }


  savePhoneDetail() {
    alert('주문하기 클릭했다.');
    //   var phoneInfo: PHONE_DETAIL = {
    //     PhoneName: '1122',
    //     camera: '',
    //     camera_comment: '',
    //     inches: '',
    //     installment_type: '',
    //     net_type_5g : true,
    //     net_type_lte : true,
    //     origin_price: '',
    //     power: '',
    //     promo_category: '',
    //     size_x: '',
    //     size_y: '',
    //     size_z: '',
    //     storage: '',
    //     using_play_type: '',
    //     video: '',
    //     weight: '',
    //     colors: [],
    //     gov_price: 10,
    //     gov_price_end: 0,
    //     gov_price_start: 0,
    //     device_installment: [12, 24]
    //   };

    //   phoneInfo.PhoneName = '갤럭시 노트20 5G';
    //   phoneInfo.camera = '333';
    //   phoneInfo.storage = '256' + 'G';
    //   phoneInfo.origin_price = '1199000';


    //   this.deviceService.addDeviceDb('Phone', phoneInfo);
  }
}

// @Component ({
//   selector : 'app-phone-call-dialog',
//   template : "`<a [routerLink]="[tel:${'01032254421'}]">SK BizOne</a>`"
// })
// export class PhoneCallDialog{}
