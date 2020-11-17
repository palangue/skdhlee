import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  @Input() deviceName : string = "갤럭시 S20 FE 5G";

  isHovering : boolean;
  files : File[] = [];
  isPrimary = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleHover(event : boolean){
    this.isHovering = event;
  }

  onDrop(imageTarget : string, files : FileList){
    if(imageTarget === 'primary')
      this.isPrimary = true;
    else
      this.isPrimary = false;
    
    for ( let i = 0 ; i < files.length ; i ++ ){
      this.files.push(files[i]);
    }
  }

}
