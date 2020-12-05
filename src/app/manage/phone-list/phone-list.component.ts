import { StorageService } from '../../services/storage.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DeviceService } from '../../device.service';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

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

  headerColumnInfo: string[] = ['PhoneName', 'ModelName', 'storage', 'newPrice', 'changePrice', 'movePrice', 'custom'];

  phoneName: string;

  constructor(
    private firestore: AngularFirestore,
    private service: DeviceService,
    private storageService: StorageService,
    private route: Router) {
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
    console.log('btnTest1', obj);
    this.route.navigateByUrl('phone-detail', { state: { phoneName: obj.PhoneName } });
  }

  // 삭제
  btnDeletePhone(value: string, value2: string): void {
    console.log('btnTest2', value);
    console.log('value222222 = ' + value2);
    this.storageService.GetStorage(value);
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

    this.phoneSub = this.service.getDeviceDb('Phone').valueChanges({ idField: 'idx' }).subscribe(res => {
      this.phoneList = Array.from(res);

      console.log(this.phoneList);

      this.dataSource = new MatTableDataSource(this.phoneList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  // 단말기 추가 화면으로 이동 ( 테스트 코드 )
  btnAddDevice(): void {
    this.route.navigateByUrl('admin/phone-detail', { state: { sumdata: 2, readdata: '123' } })
  }
  // 단말기 수정 코드 추가 필요


  // 단말기 삭제/활성화/비활성화
  deletePhone(id: string): void {
    console.log('deletePhone');
    // this.service.deleteDevice('Phone', id);
  }
  enablePhone(id: string): void {
    console.log('enablePhone');
    // this.service.enableDevice('Phone', id, true);
  }
  disablePhone(id: string): void {
    console.log('disablePhone');
    // this.service.enableDevice('Phone', id, false);
  }


}
