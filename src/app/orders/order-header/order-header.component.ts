import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.css']
})
export class OrderHeaderComponent implements OnInit {

  @Input() phoneName : string;
  @Input() phonePrice : string;
  
  publicPrice : string;

  constructor() { }

  ngOnInit(): void {
  }

}
