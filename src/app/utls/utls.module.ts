import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorBoxComponent } from './color-box/color-box.component';
import { ImgCtrlComponent } from './img-ctrl/img-ctrl.component';
import { environment } from 'src/environments/environment';
import { UploadCtrlComponent } from './upload-ctrl/upload-ctrl.component';


import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatCardModule } from '@angular/material/card';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';





import { FlexLayoutModule} from '@angular/flex-layout';
import { UploaderComponent } from './uploader/uploader.component';
import { DropzoneDirective } from './uploader/dropzone.directive';
import { StorageCtrlComponent } from './storage-ctrl/storage-ctrl.component';


const MaterialModuls = [
  MatCardModule,
  MaterialFileInputModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatIconModule,
  MatToolbarModule,
  MatRadioModule,
  MatButtonModule
]

@NgModule({
  declarations: [ColorBoxComponent, ImgCtrlComponent, UploadCtrlComponent, UploaderComponent, DropzoneDirective, StorageCtrlComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModuls
  ],
  exports: [
    ColorBoxComponent,
    ImgCtrlComponent,
    UploadCtrlComponent,
    UploaderComponent,
    StorageCtrlComponent
  ]
})
export class UtlsModule { }
