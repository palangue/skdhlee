import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


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


        // Phone Data base 에 이미지 경로 등록
        // ex) this.db.collection('files').add( { downloadURL: this.downloadURL, path });
      })
    );
    console.log('여기 확인 해 보셈 upload-ctrl.component');
  }

  isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
