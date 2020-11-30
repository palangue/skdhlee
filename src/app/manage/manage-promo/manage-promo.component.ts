import { UserService } from './../../user.service';
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

  pageIndexer: string;

  mediaSub: Subscription;
  menuChangeSub: Subscription;
  deviceXs: boolean;

  private DataBase: AngularFirestore;
  private itemsCollection: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore, public mediaObserver: MediaObserver,
    public userService: UserService) {

    this.DataBase = db;
    this.menuChangeSub = userService.adminMenuPos.subscribe(ref => {
      this.pageIndexer = ref;
    });
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
    if (this.menuChangeSub) {
      this.menuChangeSub.unsubscribe();
    }
  }

  setPage(event) {
    this.pageIndexer = event;
  }

  getPromotionList(dbName: string) {
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getCustomerList(dbName: string, promotion_name: string) {
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getUsers(dbName: string) {
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
  getPhoneList(dbName: string, promotion_name: string) {
    this.itemsCollection = this.DataBase.collection<any>(dbName, (ref) => ref);
    return this.itemsCollection.valueChanges();
  }
}
