import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DeviceService } from '../../device.service';
import { IPhoneStorage, PHONE_DETAIL, IColorSet } from '../../../models/PhoneDetail';
@Component({
  selector: 'app-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.css']
})


export class PhoneDetailComponent implements OnInit, OnDestroy {

  phoneName = '';

  phoneSub: Subscription;
  phoneInfo: PHONE_DETAIL;
  tempPhoneInfo: PHONE_DETAIL;

  storageList: Array<IPhoneStorage> = [
    { Size: 128, NewDevice: 33330, ChangeDevice: 20000, MoveNumber: 40000 },
    { Size: 256, NewDevice: 50000, ChangeDevice: 60000, MoveNumber: 70000 },
  ];

  colorList: Array<IColorSet> = [
    { name: '러시안 블루', value: '#0000ff' },
    { name: '이탈리안 레드', value: '#ff0000' }
  ];

  storageTableColumns: string[] = ['storage', 'newDevice', 'changeDevice', 'moveNumber', 'actions'];
  colorTableColumns: string[] = ['color_name_kor', 'color_value', 'color_actions'];

  constructor(
    private deviceService: DeviceService,
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<PhoneDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data) {
      this.phoneInfo = data.phoneInfo;
    }
    else {
      this.phoneInfo = {
        PhoneName: '',
        ModelName: '',
        camera: '',
        camera_comment: '',
        colors: [],
        device_installment: [],
        gov_price: 0,
        inches: '',
        installment_type: '',
        mainImgSrc: '',
        net_type_5g: false,
        net_type_lte: false,
        origin_price: '',
        power: '',
        promo_category: '',
        size_x: '',
        size_y: '',
        size_z: '',
        ChangeDevice: 0,
        NewDevice: 0,
        MoveNumber: 0,
        storageSize: 0,
        storage: {
          ChangeDevice: 0,
          MoveNumber: 0,
          Size: 0,
          NewDevice: 0,
        },
        using_play_type: '',
        video: '',
        weight: ''
      };
    }
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {

  }

  btnSavePhoneDefaultInfo(): void {

    console.log('Save Phone Default Info ', this.phoneInfo);
    //#region 저장 필수 데이터 체크
    if (this.phoneInfo.PhoneName.length < 1) {
      alert('단말기 이름을 확인 하세요');
      return;
    }
    if (this.phoneInfo.storageSize <= 0) {
      alert('단말기 용량을 확인 하세요.');
      return;
    }
    //#endregion

    this.phoneInfo.ModelName = this.phoneInfo.PhoneName + ' ' + this.phoneInfo.storageSize;

    this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).set(this.phoneInfo)
      .then(ref => console.log('set done ', ref))
      .catch(ref => console.log('error = ', ref));
  }

  btnSetSupportMoney(): void {
    if (this.phoneInfo.ModelName.length > 0) {
      this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).update(this.phoneInfo);
    }
    else {
      alert('단말기 정보를 확인하세요');
      return;
    }

  }
  btnModifyStorageInfo(elementInfo): void {
    console.log(elementInfo);
  }
  btnDeleteStorageInfo(elementInfo): void {
    console.log(elementInfo);
  }

}
