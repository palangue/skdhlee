import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Promotion } from '../models/Promotion';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private Database : AngularFirestore;
  private CollectionArray = {};

  private userPromoCode : string = "";

  constructor(db : AngularFirestore) { 
    this.Database = db;
  }

  //#region User Promotion Code
  getUserPromoCode()
  {
    return this.userPromoCode;
  }
  setUserPromoCode(value : string)
  {
    this.userPromoCode = value;
  }
  //#endregion

  getDeviceDb(DbName : string){
    if(this.CollectionArray[DbName])
      this.CollectionArray[DbName] = null;

      this.CollectionArray[DbName] = this.Database.collection<any>(DbName, ref => {
        return ref.where('use_gbn', '==', true);
      });
      return this.CollectionArray[DbName];
  }
  addDeviceDb(DbName : string, data : any)
  {
    if(this.CollectionArray[DbName] == null)
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
      
      this.CollectionArray[DbName].add(data).catch(res =>{
        console.log('error = ', res);
      });
  }
  updateDeviceDb(DbName : string, doc_id : string, data : any)
  {
    if(this.CollectionArray[DbName] == null)
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    
    this.CollectionArray[DbName].doc(doc_id).update(data);
  }
  deleteDevice(DbName : string, id : string)
  {
    if(this.CollectionArray[DbName] == null)
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);

    this.CollectionArray[DbName].doc(id).delete();
  }
  enableDevice(DbName : string, id : string, enabled : boolean)
  {
    if(this.CollectionArray[DbName] == null)
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    this.CollectionArray[DbName].doc(id).update({use_yn : enabled});
  }

  // 프로모션 코드 수집
  getPromotion(DbName : string)
  {
    this.CollectionArray[DbName] = this.Database.collection<Promotion>(DbName, (ref : CollectionReference) => {
      return ref;
    });
      
    return this.CollectionArray[DbName];
  }
  // 프로모션 코드로 프로모션 정보 가져오기
  getPromotionTarget(DbName : string, code : string)
  {
    return this.Database.collection<Promotion>(DbName, (ref : CollectionReference) => {
      return ref.where('promotion_target', '==', code);
    }).valueChanges().pipe(take(1));
  }


  addPromotion(data : Promotion){
    let returnData = { result : "실패", errorMessage : ""};

    const promo_db_name = 'promotion';
    const promotion_db = this.Database.collection<Promotion>(promo_db_name).add(data)
    console.log("프로모션 저장하고 등록/실패 여부 확인이 안되고 있다. 타이밍 문제 ( subscrbe )");
    return returnData;
  }
  

  //#region 이미지 서비스1!
  private ImageFileTypes = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
  ]
  validateFile(file : File) : boolean {

    return this.ImageFileTypes.includes(file.type);
  }
  //#endregion
}
