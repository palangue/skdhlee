import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceService } from '../../device.service';
import { IPhoneStorage, PHONE_DETAIL, IColorSet } from '../../../models/PhoneDetail';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.css']
})


export class PhoneDetailComponent implements OnInit, OnDestroy {

  phoneName = '';

  phoneSub: Subscription;
  phoneInfo: PHONE_DETAIL;

  storageList: Array<IPhoneStorage> = [
    { Size: 128, NewDevice: 33330, ChangeDevice: 20000, MoveNumber: 40000 },
    { Size: 256, NewDevice: 50000, ChangeDevice: 60000, MoveNumber: 70000 },
  ];

  colorList: Array<IColorSet>;

  storageTableColumns: string[] = ['storage', 'newDevice', 'changeDevice', 'moveNumber', 'actions'];
  colorTableColumns: string[] = ['color_name_kor', 'color_value', 'color_actions'];

  constructor(
    private deviceService: DeviceService,
    private firestore: AngularFirestore
  ) {

  }

  ngOnInit(): void {
    this.phoneInfo = {
      PhoneName: '',
      ModelName: '',
      camera: '',
      camera_comment: '',
      colors: [],
      device_installment: [],
      gov_price: 0,
      gov_price_end: 0,
      gov_price_start: 0,
      inches: '',
      installment_type: '',
      mainImgSrc: '',
      net_type_5g: false,
      net_type_lte: false,
      origin_price: '',
      power: '',
      price_change_device: 0,
      price_move_telecom: 0,
      price_new_regist: 0,
      price_promotion: 0,
      promo_category: '',
      size_x: '',
      size_y: '',
      size_z: '',
      storage: {
        ChangeDevice: 0,
        MoveNumber: 0,
        Size: 0,
        NewDevice: 0,
      },
      using_play_type: '',
      video: '',
      weight: ''


    }

  }
  ngOnDestroy(): void {

  }

  btnSavePhoneDefaultInfo(): void {
    console.log('phone save = ', this.phoneInfo);
    this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).set(this.phoneInfo);
  }
  btnSetSupportMoney(): void {
    console.log('Click SetSupportMoney');
  }
  btnModifyStorageInfo(elementInfo): void {
    console.log(elementInfo);
  }
  btnDeleteStorageInfo(elementInfo): void {
    console.log(elementInfo);
  }

}
