import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { Router } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { DbServiceService } from '../../db-service.service';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() deviceXs: boolean;

  id: string;
  password: string;

  loginScription: Subscription;
  userScription: Subscription;

  mediaSub: Subscription;

  constructor(
    private service: DbServiceService,
    public mediaObserver: MediaObserver,
    private userService: UserService,
    private route: Router) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }
  ngOnDestroy(): void {
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
    if (this.loginScription) {
      this.loginScription.unsubscribe();
    }
    if (this.userScription) {
      this.userScription.unsubscribe();
    }
  }
  requestLogin(): void {

    if (this.userScription) {
      this.userScription.unsubscribe();
    }

    this.userService.Login({ 'id': this.id, 'password': this.password }).subscribe(data => {
      console.log('안녕 ?', data);
      if (data.length > 0) {
        this.route.navigate(['admin/manage']);
      }
      else {
        console.log('invalid ID or Password');
      }
    });

  }
}
