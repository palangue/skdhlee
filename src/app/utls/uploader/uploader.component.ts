import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})

export class UploaderComponent implements OnInit {

  @Input() deviceName: string;

  isHovering: boolean;
  files: File[] = [];
  isPrimary = false;

  constructor() { }

  ngOnInit(): void {
    console.log('input device  name = ', this.deviceName);
  }

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(imageTarget: string, files: FileList): void {
    if (imageTarget === 'primary') {
      this.isPrimary = true;
    }
    else {
      this.isPrimary = false;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

}
