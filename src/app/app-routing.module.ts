import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPhoneComponent } from './orders/order-phone/order-phone.component';

const routes: Routes = [
  {path:'admin', loadChildren : () => import('./manage/manage.module').then(m => m.ManageModule)},
  {path:'promo', loadChildren : () => import('./promotion/promotion.module').then(m => m.PromotionModule)},
  {path:'', loadChildren : () => import('./promotion/promotion.module').then(m => m.PromotionModule)}
  //{path : '', component : ManagePromoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing : false, useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
