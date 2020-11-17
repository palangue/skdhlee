import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DeviceService } from 'src/app/device.service';
import { PHONE_DETAIL } from "../../../models/PhoneDetail";
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.css']
})
export class PhoneListComponent implements OnInit, OnDestroy, AfterViewInit {

  phoneSub : Subscription;
  planSub : Subscription;

  phoneList : Array<PHONE_DETAIL>;
  dataSource : MatTableDataSource<PHONE_DETAIL>;
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  headerColumnInfo : string[] = ['PhoneName', 'storage', 'custom'];

  phoneName : string;

  constructor(
    private service : DeviceService, 
    private route : Router) { 
    this.dataSource = new MatTableDataSource(null);
  }

  ngOnInit(): void {
    this.getPhoneList();
  }
  ngOnDestroy(): void{
    if ( this.phoneSub )
      this.phoneSub.unsubscribe();
  }
  ngAfterViewInit(){
    
  }
  btnTest1(value : string, value2 : string, obj)
  {
    console.log('btnTest1', value, value2, obj);
  }
  btnTest2(value : string, value2 : string)
  {
    console.log('btnTest2', value);
    console.log("value2 = " + value2);
    this.route.navigateByUrl('phone-detail', { state : { phoneName : value } });
  }
  btnTest3(value : string)
  {
    console.log('btnTest3', value);
  }

  // 필터
  applyFilter(event : Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 휴대폰 리스트
  getPhoneList(){
    if(this.phoneSub) this.phoneSub.unsubscribe();

    this.phoneSub = this.service.getDeviceDb('Phone').valueChanges({idField : 'idx'}).subscribe( res => {
      
      this.phoneList = res as Array<PHONE_DETAIL>;

      this.dataSource = new MatTableDataSource(this.phoneList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  // 단말기 추가 화면으로 이동 ( 테스트 코드 )
  btnAddDevice(){
    this.route.navigate(['admin/phone-detail']);
    this.route.navigateByUrl('admin/phone-detail', { state  :{ sumdata :2, readdata : "123" }})
  }
  // 단말기 수정 코드 추가 필요

  // 요금제 조회
  getPlan(){
    if(this.planSub) this.planSub.unsubscribe;

    this.planSub = this.service.getDeviceDb('using_plan').valueChanges({idField : 'idx'}).subscribe(res => {
      console.log(res);
    });
  }
  
  // 단말기 삭제/활성화/비활성화
  deletePhone(id : string){
    this.service.deleteDevice('Phone', id);
  }
  enablePhone(id : string){
    this.service.enableDevice('Phone', id, true);
  }
  disablePhone(id : string){
    this.service.enableDevice('Phone', id, false);
  }

  // 테이블 클릭 이벤트 테스트
  tableClickTest(data){
    console.log(data);
  }
}
