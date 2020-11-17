import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeviceService } from '../../device.service';
import { PromoDetailComponent } from '../promo-detail/promo-detail.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SupportPromotionDevice, Promotion } from '../../../models/Promotion'
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css'],
  animations: [
    trigger('promotion_details', [
      state('collapsed', style({ height: '0px', minHeight: '0'})),
      state('expanded', style({height : '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ] // End Animations
})
export class PromoListComponent implements OnInit {

  displayedColumns: string[] = ['coName', 'coCode', 'cost', 'start', 'end'];
  promotionDataSource : Promotion[];

  expandedElement : SupportPromotionDevice | null;
  promotionDeviceColumns : string [] = ['name', 'price', 'promotion_actions'];

  promo_sub : Subscription;

  constructor(
    public dialog : MatDialog,
    private deviceService : DeviceService
  ) { }

  ngOnInit(): void {
    this.promo_sub = this.deviceService.getPromotion('promotion').valueChanges({idField : 'idx'}).pipe(take(1)).subscribe( (ref : Promotion[]) => {

      console.log(11111111);
      
      ref.forEach((item) =>{
        console.log(22222);
        this.deviceService.getPromotion('promotion').doc(item.idx).collection('support_promo').valueChanges().pipe(take(1)).subscribe(
          ref2 => {
            console.log(333333);
            item.support = ref2;
            //this.promotionDataSource = ref;
            
          }
          
      );
      console.log(44444);
      });

      console.log(55555);
      this.promotionDataSource = ref;
      
    });

    
  }

  //#region 행사 추가 다이얼로그
  btnAddDevice(){
    const dialogRef =  this.dialog.open(PromoDetailComponent, {
      data : { width : '400px', data : false}
    });
    dialogRef.afterClosed().subscribe( result =>{
      if(result == true) alert("저장 성공");
    });
  }
  //#endregion

  promo_item_modify(data, data2){
    console.log(data, data2);
  }
  promo_item_delete(data){
    console.log(data);
  }
}
