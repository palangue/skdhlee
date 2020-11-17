import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkDateComponent } from './sk-date/sk-date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';




const material_module = [
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
]

const ngx_module = [
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
]

@NgModule({
  declarations: [SkDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    material_module,
    FlexLayoutModule,
    ngx_module
  ],
  exports : [
    SkDateComponent
  ],
  providers : [
    MatDatepickerModule,
    MatNativeDateModule,
    
    
  ]
})
export class DatetimeModule { }
