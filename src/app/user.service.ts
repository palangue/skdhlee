import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private Database : AngularFirestore;
  private CollectionArray = {};

  public authorized : BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(db : AngularFirestore) { 
    this.Database = db;
  }

  public updateData(DbName : string){
    this.CollectionArray[DbName];
  }

  public Login(param : any){
    
    return this.Database.collection<any>("Users", ref => {
      console.log('param value = ', param.id, param.password);
      return ref.where('id', '==', param.id).where('pw', '==', param.password);
    })
    .stateChanges().pipe(take(1), map( ref => {
      return ref.map(data => {
        const response = data.payload.doc.data();
        const response_id = data.payload.doc.id;
        
        if( response.id == param.id ){
          const data = { idx : response_id, id : response.id }
          this.authorized.next(true);
          return data;
        }
      })
    }));
  }

  //#region 사용자 데이터
  private getUser(DbName : string, UserId : string, Password : string ){
    if(this.CollectionArray[DbName]){
      this.CollectionArray[DbName] = null;
    }
    this.CollectionArray[DbName] = this.Database.collection<any>(DbName, (result:CollectionReference) =>{
      return result.where('id', '==', UserId).where('pw', '==', Password);
    })
    
    return this.CollectionArray[DbName];
  }
  private addUser(DbName : string, UserId : string, Password : string){
    if(this.CollectionArray[DbName] == null)
    {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }
    this.CollectionArray[DbName].add({id : UserId, pwd : Password, loginTime : null});
  }
  //#endregion

  //#region  주문 고객 데이터
  private getCustomer(DbName : string, Company : string, PromotionName : string){
    if(this.CollectionArray[DbName]){
      this.CollectionArray[DbName] = null;
    }

    this.CollectionArray[DbName] = this.Database.collection<any>(DbName, (result : CollectionReference) => {
      return result.where('promo_name', '==', PromotionName).where('promo_company', '==', Company);
    });
    return this.CollectionArray[DbName];
  }
  public addCustomer(DbName : string, data : any){
    if(this.CollectionArray[DbName] == null)
    {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }
    this.CollectionArray[DbName].add(data);
  }
  //#endregion
}
