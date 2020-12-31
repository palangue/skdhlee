import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoComponent } from './promo/promo.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromoItemComponent } from './promo-item/promo-item.component';
import { PromoMainComponent } from './promo-main/promo-main.component';
import { OrdersModule } from '../orders/orders.module';
import { UtlsModule } from '../utls/utls.module';
import { DatetimeModule } from '../datetime/datetime.module';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from '../../environments/environment';
import { PromoItemDetailComponent } from './promo-item-detail/promo-item-detail.component';
import { OrderPhoneComponent } from '../orders/order-phone/order-phone.component';

const routes:Routes = [
  {path:'promo-detail',component:PromoItemDetailComponent},
  {path:'promo-items', component:PromoItemComponent},
  {path : 'orders', component : OrderPhoneComponent},
  {path:'', component:PromoComponent}
]

const material_module = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatStepperModule,
  MatChipsModule,
  MatButtonToggleModule,
]

const angular_module = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireStorageModule,
]

@NgModule({
  declarations: [PromoComponent, PromoItemComponent, PromoMainComponent, PromoItemDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    angular_module,  
    material_module,
    OrdersModule,
    UtlsModule,
    DatetimeModule
  ]
  // exports:[
  //   PromoComponent,
  //   RouterModule
  // ]
})
export class PromotionModule { }

export declare type PROMO_DATA = {
  visible : boolean;
  code : string;
  obj : any;
}