import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPhoneComponent } from './order-phone/order-phone.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ClipboardModule} from '@angular/cdk/clipboard';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';



import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes } from '@angular/router';
import { OrderFooterComponent } from './order-footer/order-footer.component';
import { OrderHeaderComponent } from './order-header/order-header.component';
import { UtlsModule } from '../utls/utls.module';

const routes : Routes = [
  {path : '', component:OrderPhoneComponent}
]

@NgModule({
  declarations: [OrderPhoneComponent, OrderFooterComponent, OrderHeaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatToolbarModule,
    UtlsModule,
    ClipboardModule
  ],
  exports: [
    OrderPhoneComponent
  ]
})
export class OrdersModule { }
