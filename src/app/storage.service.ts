import { Injectable } from '@angular/core';

import { AngularFireStorage, AngularFireStorageModule, AngularFireUploadTask } from '@angular/fire/storage';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/*
  Image 등 파일 업로드 서비스
*/

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private readonly fireStorage: AngularFireStorage,
  ) { }

  uploadFileAndMetadata(mediaFolderPath: string, fileToUpload: File): FileUploadMetadata {

    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.fireStorage.upload(
      filePath, fileToUpload
    );

    return {
      UploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath)
    };
  }

  private getDownloadUrl$(
    UploadTask: AngularFireUploadTask,
    path: string
  ): Observable<string> {
    return from(UploadTask)
      .pipe(
        switchMap((_) =>
          this.fireStorage.ref(path).getDownloadURL()
        ));
  }
}

export interface FileUploadMetadata {
  UploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}
