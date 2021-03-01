import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeviceService } from '../../device.service';
import { PHONE_DETAIL, IColorSet, IColorSetReturn } from '../../../models/PhoneDetail';
import { PhoneInsertColorComponent } from '../phone-insert-color/phone-insert-color.component';

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

  chk5G: boolean = false;
  chkLTE: boolean = false;

  storageTableColumns: string[] = ['storage', 'newDevice', 'changeDevice', 'moveNumber', 'actions'];
  colorTableColumns: string[] = ['color_name_kor', 'color_value', 'color_actions'];

  constructor(
    private deviceService: DeviceService,
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<PhoneDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {

    if (data) {
      this.phoneInfo = data.phoneInfo;
      this.chkLTE =  this.phoneInfo.net_type_lte;
      this.chk5G = this.phoneInfo.net_type_5g;
    }
    else {
      this.phoneInfo = {
        PhoneName: '',
        ModelName: '',
        camera: '',
        camera_comment: '',
        colors: [],
        device_installment: [],
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
        storageSize: 0,
        using_play_type: '',
        video: '',
        weight: '',
        useGbn: true
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
    this.phoneInfo.net_type_5g = this.chk5G;
    this.phoneInfo.net_type_lte = this.chkLTE;

    this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).set(this.phoneInfo)
      .then(ref => console.log('set done ', ref))
      .catch(ref => console.log('error = ', ref));
  }
  btnAddColor(): void {
    const colorDialogRef = this.dialog.open(
      PhoneInsertColorComponent,
      {
        data: this.phoneInfo.colors
      });
    colorDialogRef.afterClosed().subscribe((result: IColorSetReturn) => {
      
      if (result.code == 0) {
        //this.phoneInfo.colors = result.colorSet;
        // 성공 했을 때만 업데이트 한다.
        this.btnModifyColor(null);
      }
      
    });
  }
  btnModifyColor(elementInfo): void {
    this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).update(this.phoneInfo);
  }
  btnDeleteColor(elementInfo): void {
    var testIndex = this.phoneInfo.colors.indexOf(elementInfo);
    console.log(testIndex);
    if (testIndex > -1) {
      this.phoneInfo.colors.splice(testIndex, 1);
      this.firestore.collection('Phone').doc(this.phoneInfo.ModelName).update(this.phoneInfo);
    }
  }

}
