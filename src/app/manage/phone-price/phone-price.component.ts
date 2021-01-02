import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PHONE_DETAIL } from '../../../models/PhoneDetail';

@Component({
  selector: 'app-phone-price',
  templateUrl: './phone-price.component.html',
  styleUrls: ['./phone-price.component.css']
})
export class PhonePriceComponent implements OnInit {

  @Input() phoneInfo: PHONE_DETAIL;
  @Output() outPhoneInfo: EventEmitter<PHONE_DETAIL> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
