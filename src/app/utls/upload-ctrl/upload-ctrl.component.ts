import { collectExternalReferences } from '@angular/compiler';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { PHONE_DETAIL } from 'src/models/PhoneDetail';


export const MEDIA_STORAGE_PATH = `img/`;

@Component({
  selector: 'app-upload-ctrl',
  templateUrl: './upload-ctrl.component.html',
  styleUrls: ['./upload-ctrl.component.css']
})
export class UploadCtrlComponent implements OnInit, OnDestroy {

  @Input() deviceName: string;
  @Input() file: File;
  @Input() IsPrimary: boolean;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: string;


  constructor(
    private fireStorage: AngularFireStorage,
    private db: AngularFirestore
  ) {

  }

  ngOnInit(): void {
    this.startUpload();
  }
  ngOnDestroy(): void {

  }

  startUpload(): void {

    if (this.IsPrimary === false) {
      this.deviceName = this.deviceName + '/details';
    }

    const path = `img/${this.deviceName}/${this.file.name}`;

    const ref = this.fireStorage.ref(path);
    this.task = this.fireStorage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      finalize(async () => {
        this.downloadUrl = await ref.getDownloadURL().toPromise();

        console.log('download url = ', this.downloadUrl);
        console.log('path = ', path);
        this.db.collection<PHONE_DETAIL>('Phone', ref => ref.where('PhoneName', '==', this.deviceName)).stateChanges().pipe(take(1), map(result => {
          return result.map(resultData => {
            const idx = resultData.payload.doc.id;
            const data = resultData.payload.doc.data();

            return { idx, ...data };
          });
        })).subscribe(response => {
          if (response.length > 0) {
            if (this.IsPrimary) {
              for (let item of response) {
                item.mainImgSrc = this.downloadUrl;
                this.db.collection<PHONE_DETAIL>('Phone').doc(item.idx).update(item);
              }
            }
          }
        });
      })
    );

  }

  isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
