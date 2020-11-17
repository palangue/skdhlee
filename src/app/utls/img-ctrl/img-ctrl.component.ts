import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-img-ctrl',
  templateUrl: './img-ctrl.component.html',
  styleUrls: ['./img-ctrl.component.css']
})
export class ImgCtrlComponent implements OnInit {

  storageRef : AngularFireStorageReference;
  storageTask : AngularFireUploadTask;
  uploadProgress : Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private firestorage : AngularFireStorage
    ) {

     }

  ngOnInit(): void {
  }

  // Arrow Function 처음 사용 해봄
  upload = (deviceName : string, event) =>{
    // create a reference to the storage bucket location
    this.storageRef = this.firestorage.ref(`/img/${deviceName}/` + event.target.files.name);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.storageTask = this.storageRef.put(event.target.files);

    // observe upload progress
    this.uploadProgress = this.storageTask.percentageChanges();
    // get Notified when the download URL is available
    this.storageTask.snapshotChanges().pipe(
      finalize(() => this.downloadURL = this.storageRef.getDownloadURL())
    )
    .subscribe();
    
    // state 도 추가 해 볼까 ?
  }

  
}
