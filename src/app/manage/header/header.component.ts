import { UserService } from './../../user.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() deviceXs: boolean;
  @Output() selectedMenu = new EventEmitter<string>();

  constructor(private route: Router, private userService: UserService) {
    console.log('manage-header-constructor');
  }

  ngOnInit(): void {
  }

  gotoPromotion(): void {
    this.userService.adminMenuPos.next('promo_list');
  }
  gotoPayment(): void {
    this.userService.adminMenuPos.next('plan_list');
  }
  gotoDevice(): void {
    this.userService.adminMenuPos.next('phone_list');
  }
  gotoCustomers(): void {
    this.userService.adminMenuPos.next('customer_list');
  }
}
