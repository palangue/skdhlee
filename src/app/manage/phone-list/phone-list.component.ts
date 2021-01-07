import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhoneDetailComponent } from '../phone-detail/phone-detail.component';
import { StorageService } from '../../services/storage.service';
import { DeviceService } from '../../device.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';


@Component({
  selector: 'app-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.css']
})
export class PhoneListComponent implements OnInit, OnDestroy {

  phoneSub: Subscription;
  planSub: Subscription;

  phoneList: Array<PHONE_DETAIL>;
  dataSource: MatTableDataSource<PHONE_DETAIL>;
  // phoneDataSource: MatTableDataSource<PHONE_DETAIL>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  headerColumnInfo: string[] = ['PhoneName', 'ModelName', 'storage', 'manufacturerPrice', 'custom'];

  phoneName: string;

  constructor(
    private firestore: AngularFirestore,
    private service: DeviceService,
    private storageService: StorageService,
    private route: Router,
    private dialog: MatDialog
    ) {
    this.dataSource = new MatTableDataSource(null);
  }

  ngOnInit(): void {
    this.getPhoneList();
  }
  ngOnDestroy(): void {
    if (this.phoneSub) {
      this.phoneSub.unsubscribe();
    }
  }

  // 수정
  btnShowPhoneDetail(obj: PHONE_DETAIL): void {
    const dialogRef = this.dialog.open(PhoneDetailComponent, {
      data: {
        phoneInfo: obj
      }
    });
    dialogRef.afterClosed().subscribe(ref => {
      console.log(ref);
    });
  }

  // 활성 / 비활성
  btnUpdateEnable(obj: PHONE_DETAIL): void{
    const phoneInfo = obj;
    phoneInfo.useGbn = !phoneInfo.useGbn;
    this.firestore.collection('Phone').doc(phoneInfo.ModelName).update(phoneInfo);
  }
  // 삭제
  btnDeletePhone(value: string): void {
    this.firestore.collection('Phone').doc(value).delete();
    // this.storageService.GetStorage(value);
  }

  // 필터
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 휴대폰 리스트
  getPhoneList(): void {
    if (this.phoneSub) { this.phoneSub.unsubscribe(); }

    this.phoneSub = this.firestore.collection('Phone').snapshotChanges()
    .pipe(map( ref=>{
      return ref.map( (a: any) =>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;

        return {id, ...data};
      });
    })).subscribe(ref => {
      this.phoneList = Array.from(ref);

      this.dataSource = new MatTableDataSource(this.phoneList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // 단말기 추가 화면으로 이동 ( 테스트 코드 )
  btnAddDevice(): void {
    const dialogRef = this.dialog.open(PhoneDetailComponent, { data: null });
    dialogRef.afterClosed().subscribe( ref => {
      console.log(ref);
    });
    
  }
  // TODO: 단말기 활성/비활성 추가 필요. (판매중지)
}
