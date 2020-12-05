import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private firestore: AngularFirestore) { }

  public GetStorage(phoneName: string): void {
    console.log('Here is Storage Service.ts', 'phoneName = ', phoneName);
    // tslint:disable-next-line: max-line-length
    // this.firestore.collection('Phone',
    //   (ref => ref.where('PhoneName', '==', phoneName)))
    //   .stateChanges()
    //   .pipe(map((mapData) => {
    //     return mapData.map(payload => {
    //       const temp = {
    //         id: payload.payload.doc.id,
    //         info: payload.payload.doc.data()
    //       };
    //       const storageData = this.firestore.collection('Phone').doc(payload.payload.doc.id).collection('Storage').valueChanges().subscribe(res => {
    //         console.log(res);
    //       });
    //       console.log(storageData);
    //       return temp;
    //     });
    //   }))
    //   .subscribe(sub => {
    //     console.log('sub = ', sub);
    //   });
  }
}
