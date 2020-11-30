import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DbServiceService } from '../../db-service.service';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/device.service';
import { Subscription } from 'rxjs';
import { take, map, flatMap } from 'rxjs/operators';
import { Promotion } from '../../../models/Promotion';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-promo-main',
  templateUrl: './promo-main.component.html',
  styleUrls: ['./promo-main.component.css']
})
export class PromoMainComponent implements OnInit {

  @Input() deviceXs: boolean;


  promo_code: string = '';
  invalid_code: boolean;
  deviceDb: Subscription;

  Database: AngularFirestore;

  constructor(
    private dbService: DbServiceService,
    private deviceService: DeviceService,
    private db: AngularFirestore,
    private rout: Router) {

  }

  ngOnInit(): void {
  }

  ConfirmPromoCode(): void {
    console.log('input code complete', this.promo_code);

    this.deviceService.getPromotionTarget('Promotion', this.promo_code).subscribe((ref: Promotion[]) => {
      console.log(ref);
      if (ref.length == 1) {
        this.invalid_code = false;
        this.deviceService.setUserPromoCode(ref[0].promotion_target);
        this.dbService.addData(true, { promo_code: this.promo_code, visible: true })
        this.rout.navigate(['/promo-items']);
      }
      else {
        this.invalid_code = true;
        alert(`프로모션 코드가 ${ref.length} 개 검색 되었습니다. 관리자에게 문의 해 주세요 ( Tel: 010-0000-0000 ) `);
      }
    });
  }

}
