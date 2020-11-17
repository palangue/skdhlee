import { Component, OnInit, OnDestroy } from '@angular/core';

import { MediaObserver, MediaChange} from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DbServiceService } from '../../db-service.service';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit, OnDestroy {

  mainPage = true;
  itemPage = false;
  promo_code = 'abc';

  mediaSub : Subscription;
  deviceXs : boolean;

  constructor(public mediaObserver : MediaObserver, private service : DbServiceService) {
    console.log('promo_constructor');
   }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe((result : MediaChange) => {
      //console.log(result.mqAlias);
      console.log(result.mediaQuery);
      this.deviceXs = result.mqAlias === 'xs' ? true: false;
      this.service.promo_scription.subscribe( arg => {
        if( arg.visible == true )
        {
          this.mainPage = false;
          this.itemPage = true;
        }
      })
    })
  }

  ngOnDestroy() : void {
    this.mediaSub.unsubscribe();
  }

  
  
}

