import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.css']
})
export class ColorBoxComponent implements OnInit {

  @Input() phoneColor: string;

  constructor() {

  }

  ngOnInit(): void {
  }

}
