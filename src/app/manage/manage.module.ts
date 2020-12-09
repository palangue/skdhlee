import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePromoComponent } from './manage-promo/manage-promo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { PromoListComponent } from './promo-list/promo-list.component';
import { LoginComponent } from './login/login.component';
import { DatetimeModule } from '../datetime/datetime.module';
import { UtlsModule } from '../utls/utls.module';
import { PhoneListComponent } from './phone-list/phone-list.component';
import { PromoDetailComponent } from './promo-detail/promo-detail.component';
import { PhoneDetailComponent } from './phone-detail/phone-detail.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';



import { FlexLayoutModule } from '@angular/flex-layout';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { PhoneStorageComponent } from './phone-storage/phone-storage.component';
import { PhonePriceComponent } from './phone-price/phone-price.component';



const routes: Routes = [
  { path: 'manage', component: ManagePromoComponent },
  //{path:'manage', component:ManagePromoComponent, canActivate : [AuthGuard]},
  { path: 'phone-detail', component: PhoneDetailComponent },
  { path: 'phone-list', component: PhoneListComponent },
  { path: '', component: LoginComponent, children : [

  ] }
]

const MaterialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatCardModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  UtlsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatListModule
]

@NgModule({
  declarations: [ManagePromoComponent, HeaderComponent, NavbarComponent, PromoListComponent, LoginComponent, PhoneListComponent, PromoDetailComponent, PhoneDetailComponent, PlanDetailComponent, PlanListComponent, CustomerListComponent, PhoneStorageComponent, PhonePriceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    FlexLayoutModule,
    DatetimeModule
  ]
})
export class ManageModule { }
