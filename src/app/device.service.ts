import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Promotion } from '../models/Promotion';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(db: AngularFirestore) {
    this.Database = db;
  }

  private Database: AngularFirestore;
  private CollectionArray = {};

  private userPromoCode = '';


  //#region 이미지 서비스1!
  private ImageFileTypes = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
  ];

  //#region User Promotion Code
  getUserPromoCode(): string {
    return this.userPromoCode;
  }
  setUserPromoCode(value: string): void {
    this.userPromoCode = value;
  }
  //#endregion

  getDeviceDb(DbName: string): any {
    if (this.CollectionArray[DbName]) {
      this.CollectionArray[DbName] = null;
    }

    this.CollectionArray[DbName] = this.Database.collection<any>(DbName, ref => {
      return ref.where('use_gbn', '==', true);
    });
    return this.CollectionArray[DbName];
  }
  // TODO: 정상 처리, 실패에 대한 메세지 리턴 필요
  addDeviceDb(DbName: string, data: any): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }

    this.CollectionArray[DbName].add(data).catch(res => {
      console.log('error = ', res);
    });
  }
  updateDeviceDb(DbName: string, doc_id: string, data: any): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }

    this.CollectionArray[DbName].doc(doc_id).update(data);
  }
  deleteDevice(DbName: string, id: string): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }

    this.CollectionArray[DbName].doc(id).delete();
  }
  enableDevice(DbName: string, id: string, enabled: boolean): void {
    if (this.CollectionArray[DbName] == null) {
      this.CollectionArray[DbName] = this.Database.collection<any>(DbName);
    }
    this.CollectionArray[DbName].doc(id).update({ use_yn: enabled });
  }

  // 프로모션 코드 수집
  getPromotion(DbName: string): any {
    this.CollectionArray[DbName] = this.Database.collection<Promotion>(DbName, (ref: CollectionReference) => {
      return ref;
    });

    return this.CollectionArray[DbName];
  }
  // 프로모션 코드로 프로모션 정보 가져오기
  getPromotionTarget(DbName: string, code: string): Observable<Promotion[]> {
    return this.Database.collection<Promotion>(DbName, (ref: CollectionReference) => {
      return ref.where('promotion_target', '==', code);
    }).valueChanges().pipe(take(1));
  }
  getPromotionDb(): AngularFirestoreCollection {
    return this.Database.collection<Promotion>('Promotion');
  }

  addPromotion(data: Promotion): any {
    const returnData = { result: '실패', errorMessage: '' };

    this.Database.collection<Promotion>('Promotion').add(data);
    console.log('프로모션 저장하고 등록/실패 여부 확인이 안되고 있다. 타이밍 문제 ( subscrbe )');
    return returnData;
  }

  validateFile(file: File): boolean {
    return this.ImageFileTypes.includes(file.type);
  }
  //#endregion
}
