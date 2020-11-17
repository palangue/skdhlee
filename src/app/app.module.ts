import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {ManageModule} from './manage/manage.module';
import {PromotionModule} from './promotion/promotion.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DbServiceService } from './db-service.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ManageModule,
    PromotionModule,
    BrowserAnimationsModule,
        
  ],
  providers: [DbServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
