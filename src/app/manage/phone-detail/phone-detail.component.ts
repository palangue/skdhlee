import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceService } from '../../device.service';
import { IPhoneStorage, PHONE_DETAIL, IColorSet } from '../../../models/PhoneDetail';
import { Location } from '@angular/common';

@Component({
  selector: 'app-phone-detail',
  templateUrl: './phone-detail.component.html',
  styleUrls: ['./phone-detail.component.css']
})
export class PhoneDetailComponent implements OnInit, OnDestroy {

  phoneName : string;

  phoneSub : Subscription;
  phoneInfo : PHONE_DETAIL;

  storageList : Array<IPhoneStorage> = [
    { size : 32, newRegist : "33330", changeDevice : '20000', changeNumber : '40000'},
    { size : 128, newRegist : "50000", changeDevice : '60000', changeNumber : '70000'},
  ];

  colorList : Array<IColorSet>;

  storageTableColumns: string[] = ['storage', 'newRegist', 'changeDevice', 'changeNumber', 'actions'];
  colorTableColumns: string[] = ['color_name_kor', 'color_value', 'color_actions'];

  constructor(
    private deviceService : DeviceService, 
    private route : Router,
    private activatedRouter : ActivatedRoute,
    private location : Location
  ) { 
    if( this.route.getCurrentNavigation() != null )
    {
      const routedState = this.route.getCurrentNavigation().extras.state;
      this.phoneName = routedState.phoneName;
    }
    

  }

  ngOnInit(): void {
    
    
    // if(this.phoneName != undefined && this.phoneName.length > 0){
      // this.phoneSub = this.deviceService.getDeviceDb("Phone").valueChanges().subscribe( ref => {
      //   console.log(ref);
      // });
    // }


  }
  ngOnDestroy() : void {
    // if(this.phoneSub)
    //   this.phoneSub.unsubscribe();
  }

  btnModifyStorageInfo(elementInfo){
    console.log(elementInfo);
  }
  btnDeleteStorageInfo(elementInfo){
    console.log(elementInfo);
  }
  goBack(){
    this.location.back();
  }
}
