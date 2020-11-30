import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private Database: AngularFirestore;
  private CollectionArray = {};

  public authorized: BehaviorSubject<any> = new BehaviorSubject(false);
  public adminMenuPos: BehaviorSubject<any> = new BehaviorSubject('promo_list');
  constructor(db: AngularFirestore) {
    this.Database = db;
  }


  // Admin User Login
  public Login(param: any): any {

    return this.Database.collection<any>('Users', ref => {
      console.log('param value = ', param.id, param.password);
      return ref.where('id', '==', param.id).where('pw', '==', param.password);
    })
      .stateChanges().pipe(take(1), map(ref => {
        return ref.map(data => {
          const response = data.payload.doc.data();
          const responseId = data.payload.doc.id;

          if (response.id === param.id) {
            // tslint:disable-next-line: no-shadowed-variable
            const data = { idx: responseId, id: response.id }
            this.authorized.next(true);
            return data;
          }
        });
      }));
  }

  //#region 사용자 데이터
  private getUser(DbName: string, UserId: string, Password: string): AngularFirestoreCollection {
    if (this.CollectionArray[DbName]) {
      this.CollectionArray[DbName] = null;
    }
    this.CollectionArray[DbName] = this.Database.collection<any>(DbName, (result: CollectionReference) => {
      return result.where('id', '==', UserId).where('pw', '==', Password);
    });

    return this.CollectionArray[DbName];
  }
  private addUser(DbName: string, UserId: string, Password: string): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }
    this.CollectionArray[DbName].add({ id: UserId, pwd: Password, loginTime: null });
  }
  //#endregion

  //#region  주문 고객 데이터

  public addCustomer(DbName: string, data: any): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }
    this.CollectionArray[DbName].add(data)
      .then(result => console.log('add Customer success'))
      .catch(err => console.log('add Customer error = ' + err));
  }
  //#endregion
}
