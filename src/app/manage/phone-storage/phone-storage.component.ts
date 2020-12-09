import { Component, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPhoneStorage, PHONE_DETAIL } from 'src/models/PhoneDetail';

@Component({
  selector: 'app-phone-storage',
  templateUrl: './phone-storage.component.html',
  styleUrls: ['./phone-storage.component.css']
})
export class PhoneStorageComponent implements OnInit {

  @Input() phoneInfo: PHONE_DETAIL;
  @Output() outPhoneInfo: PHONE_DETAIL;

  storageList: Array<IPhoneStorage> = [
    { Size: 128, NewDevice: 33330, ChangeDevice: 20000, MoveNumber: 40000 },
    { Size: 256, NewDevice: 50000, ChangeDevice: 60000, MoveNumber: 70000 },
  ];

  storageTableColumns: string[] = ['storage', 'newDevice', 'changeDevice', 'moveNumber', 'actions'];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    // TODO: 초기화 데이터, 반환 값 연동 필요
    if (this.phoneInfo)
    {
      this.storageList = [ this.phoneInfo.storage ] ;
    }
  }

  btnModifyStorageInfo(item): void
  {
    // TODO: 수정 추가
    console.log(item);
  }
  btnDeleteStorageInfo(item): void{
    // TODO: 삭제는 있으면 안되는데 ?
    console.log(item);
  }
}
