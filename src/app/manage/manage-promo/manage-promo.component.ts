import { Component, OnInit, OnDestroy } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-manage-promo',
  templateUrl: './manage-promo.component.html',
  styleUrls: ['./manage-promo.component.css']
})
export class ManagePromoComponent implements OnInit, OnDestroy {

  opened = false;

  pageIndexer : string = 'promo_list';

  mediaSub : Subscription;
  deviceXs : boolean;
  
  private DataBase : AngularFirestore;
  private itemsCollection: AngularFirestoreCollection<any>;

  constructor(db : AngularFirestore, public mediaObserver : MediaObserver) { 
    console.log('manage-constructor');
    this.DataBase = db;
    // this.getPromotionList('promotion').subscribe((res) => {
    //   console.log(res)
    // });
  }

  ngOnInit(): void {
    console.log('manage-promo init');
    this.mediaSub = this.mediaObserver.media$.subscribe((result : MediaChange) =>{
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }
  ngOnDestroy() : void {
    console.log('manage-promo destroy');
    this.mediaSub.unsubscribe();
  }

  setPage(event){
    this.pageIndexer = event;
  }

  getPromotionList(dbName : string){
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getCustomerList(dbName : string, promotion_name : string){
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getUsers(dbName : string){
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getPhoneList(dbName : string, promotion_name : string){
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
}
