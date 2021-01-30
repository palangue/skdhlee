import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { DbServiceService } from '../../db-service.service';
import { Promotion } from '../../../models/Promotion';
import { DeviceService } from '../../device.service';


@Component({
  selector: 'app-promo-main',
  templateUrl: './promo-main.component.html',
  styleUrls: ['./promo-main.component.css']
})
export class PromoMainComponent implements OnInit {

  @Input() deviceXs: boolean;


  promo_code = '';
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

    this.deviceService.getPromotionTarget('Promotion', this.promo_code)
    .subscribe((ref: Promotion[]) => {
      console.log(ref);
      if (ref.length === 1) {
        this.invalid_code = false;

        this.deviceService.setUserPromoCode(ref[0]);
        this.dbService.addData(true, { promo_code: ref[0].promotion_target, promo_company: ref[0].promotion_target_company, visible: true })
        //this.rout.navigate(['/promo-items']);
      }
      else {
        this.invalid_code = true;
        alert(`프로모션 코드가 ${ref.length} 개 검색 되었습니다. 관리자에게 문의 해 주세요 ( Tel: 010-0000-0000 ) `);
      }
    });
  }

}
