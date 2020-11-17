import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  @Input() deviceXs : boolean;
  @Output() selectedMenu = new EventEmitter<string>();

  constructor(private route : Router) { 
    console.log('manage-header-constructor');
  }

  ngOnInit(): void {
  }

  gotoPromotion(){
    console.log('gotoPromotion()');
    this.selectedMenu.emit('promo_list');

    //this.route.navigate(['/manage']);
  }
  gotoPayment(){
    this.selectedMenu.emit('phone_detail');
  }
  gotoDevice(){
    console.log('gotoDevice()');
    this.selectedMenu.emit('phone_list');
    //this.route.navigate(['/phone-detail']);
  }
}
