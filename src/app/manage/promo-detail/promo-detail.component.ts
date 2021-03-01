import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeviceService } from '../../device.service';
import { SupportPromotionDevice, PromotionDialogResult, PromoSupportDialogData } from '../../../models/Promotion';
import { map, take } from 'rxjs/operators';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { PlanDataGroup } from '../../../models/PaymentPlan';


@Component({
  selector: 'app-promo-detail',
  templateUrl: './promo-detail.component.html',
  styleUrls: ['./promo-detail.component.css']
})
export class PromoDetailComponent implements OnInit, OnDestroy {

  typeDevice = false;
  index = '';
  isModify = false;

  disableNetworkSelection = true;    // 단말기 선택 후 요금제 정보를 가져 오면 활성화, 아니면 비활성화.

  //supportDevice: Array<SupportPromotionDevice>;
  supportDevice: Array<any>;
  selectedSupportDeviceAndPlanList: Array<any> = [];

  promotionGroup: FormGroup;
  deviceGroup: FormGroup;
  planGroup: FormGroup;

  PhoneList: Array<PHONE_DETAIL>;
  PayPlanList: Array<PlanDataGroup>;
  SelectedPayPlanList: Array<string>;

  selectedDeviceName: string;
  selectedNetType: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PromoSupportDialogData,
    private _formGroup: FormBuilder,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<PromoDetailComponent>,

  ) {

    this.typeDevice = true;
    this.index = data.id;

    console.log('index = ', this.index);
  }

  ngOnInit(): void {

    // 수정으로 진입 한것인지 확인
    if (this.data.supportDeviceData) {
      this.isModify = true;
    }

    console.log('supportData', this.data.supportDeviceData);
    console.log('phoneList', this.data.phoneList);
    console.log('planList =', this.data.planGroup);

    this.PhoneList = this.data.phoneList;
    this.PayPlanList = this.data.planGroup;


  }


  ngOnDestroy(): void {

  }

  // 순차 저장
  btnSave(): void {

    let errList: Array<string> = [];

    for (let item of this.selectedSupportDeviceAndPlanList) {
      if (item.idx === undefined || item.idx.length === 0) {
        this.deviceService.getPromotionDb()
          .doc(this.index)
          .collection('support_device')
          .add(item)
          .catch((err) => errList.push(err));
      }
      else {
        this.deviceService.getPromotionDb()
          .doc(this.index)
          .collection('support_device')
          .doc(item.idx)
          .update(item)
          .catch((err) => errList.push(err));
      }
    }

    if (errList.length === 0) {
      const msgData: PromotionDialogResult = {
        code: 0,
        message: '성공'
      };

      this.dialogRef.close(msgData);
    }
    else {
      const msgData: PromotionDialogResult = {
        code: 99,
        message: errList.toString()
      };

      this.dialogRef.close(msgData);
    }


  }
  // 취소
  cancel(): void {
    this.dialogRef.close({ code: -1, message: '' });
  }

  getSupportDeviceAndPlanList() {

    this.deviceService.getPromotionDb()
      .doc(this.index)
      .collection('support_device', ref => ref.where('deviceName', '==', this.selectedDeviceName))
      .stateChanges().pipe(take(1), map(result => {
        return result.map(resultData => {
          const idx = resultData.payload.doc.id;
          const data = resultData.payload.doc.data();
          return { idx, ...data };
        });
      })).subscribe((ref: Array<any>) => {
        this.supportDevice = ref;
        this.disableNetworkSelection = false;
      });
  }

  onDeviceSelected(selectedDevice: string): void {

    // 단말기 선택이 변경되면 망 선택 항목도 초기화 해야 한다.
    this.selectedNetType = '';
    // 선택 된 단말기가 지원 가능 한 요금제 타이틀을 select 박스에 셋팅한다.
    this.SelectedPayPlanList = [];


    
    // 전체 단말기 리스트에서 선택 된 단말기를 가져온다.
    const chosenPhoneDetail = this.PhoneList.find(x => x.ModelName === this.selectedDeviceName);
    
    // 선택 된 단말기가 설정 가능한 네트워크를 select box 에 설정
    if (chosenPhoneDetail.net_type_5g) {
      this.SelectedPayPlanList.push('5G');
    }
    if (chosenPhoneDetail.net_type_lte) {
      this.SelectedPayPlanList.push('LTE');
    }

    // 선택 된 단말기가 지원 가능 한 모든 요금제 가져온다
    this.disableNetworkSelection = true;
    this.getSupportDeviceAndPlanList();

  }
  onNetworkSelected(): void {

    this.selectedSupportDeviceAndPlanList = [];

    const listOfSupportedList = this.supportDevice.filter(x => x.sktNetType === this.selectedNetType);

    // 사용 가능한 요금제 리스트를 수집 / 정렬한다.
    const chosenPlan = this.PayPlanList.find(x => x.name === this.selectedNetType);

    for (let item of chosenPlan.value) {

      let foundedSupportedDevice = listOfSupportedList.find(x => x.sktNetType === item.netKind && x.planName === item.name);

      // 찾은 데이터가 없을 때
      if (foundedSupportedDevice === undefined) {
        foundedSupportedDevice = {
          deviceName: this.selectedDeviceName,
          planName: item.name,
          sktNetType: item.netKind,
          monthPay: item.monthPay,
          publicPrice: '0',
          // 공시 지원금
          changeDevice: '0',
          moveNumber: '0',
          newDevice: '0',
          // 선택약정
          changeDeviceInstallment: '0',
          moveNumberInstallment: '0',
          newDeviceInstallment: '0',
        }
      }

      let tempItem = null;
      if (foundedSupportedDevice.idx === undefined) {
        tempItem =
        {
          deviceName: this.selectedDeviceName,
          planName: item.name,
          sktNetType: item.netKind,
          monthPay: item.monthPay,
          publicPrice: foundedSupportedDevice.publicPrice,
          // 공시지원금
          newDevice: foundedSupportedDevice.newDevice ? foundedSupportedDevice.newDevice : '0',
          changeDevice: foundedSupportedDevice.changeDevice ? foundedSupportedDevice.changeDevice : '0',
          moveNumber: foundedSupportedDevice.moveNumber ? foundedSupportedDevice.moveNumber : '0',
          // 선택약정
          newDeviceInstallment: foundedSupportedDevice.newDeviceInstallment ? foundedSupportedDevice.newDeviceInstallment : 0,
          changeDeviceInstallment: foundedSupportedDevice.changeDeviceInstallment ? foundedSupportedDevice.changeDeviceInstallment : 0,
          moveNumberInstallment: foundedSupportedDevice.moveNumberInstallment ? foundedSupportedDevice.moveNumberInstallment : 0,
        };
      }
      else {
        tempItem =
        {
          idx: foundedSupportedDevice.idx,
          deviceName: this.selectedDeviceName,
          planName: item.name,
          sktNetType: item.netKind,
          monthPay: item.monthPay,
          publicPrice: foundedSupportedDevice.publicPrice,
          // 공시 지원금
          changeDevice: foundedSupportedDevice.changeDevice ? foundedSupportedDevice.changeDevice : '0',
          moveNumber: foundedSupportedDevice.moveNumber ? foundedSupportedDevice.moveNumber : '0',
          newDevice: foundedSupportedDevice.newDevice ? foundedSupportedDevice.newDevice : '0',
          // 선택약정
          newDeviceInstallment: foundedSupportedDevice.newDeviceInstallment ? foundedSupportedDevice.newDeviceInstallment : 0,
          changeDeviceInstallment: foundedSupportedDevice.changeDeviceInstallment ? foundedSupportedDevice.changeDeviceInstallment : 0,
          moveNumberInstallment: foundedSupportedDevice.moveNumberInstallment ? foundedSupportedDevice.moveNumberInstallment : 0,
        };

      }

      this.selectedSupportDeviceAndPlanList.push(tempItem);
    }

    console.log(this.selectedSupportDeviceAndPlanList.sort((x, y) => x.planName > y.planName ? 1 : -1));

  }

}
// TODO: 수정 쪽에 처리 하나도 안되어 있음
// TODO: 공시 지원금은 단말기 별, 요금제 별로 다르고, 기변 번이 신규와 상관없이 동일하다.

// TODO: 통신망 별로 테이블 입력 폼을 만들자
// TODO: 망 정보를 가져와서 단말기의 5G, LTE 지원 상태에 따라서 입력 폼을 생성
// ex. if 5g == phone.enable_5g 
//           5GX 스탠다드, 신규, 번이, 기변
//           5G 슬림, 신규, 번이, 기변
//         push to array

