import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DbServiceService } from './db-service.service';
import { UserService } from './user.service';
import { ResourceLoader } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private status : boolean = false;

  constructor(private service : DbServiceService, private userService : UserService){
    this.service.IsLogged.subscribe( result => {
      this.status = result;
    });
    this.userService.authorized.subscribe( result => {
      console.log("들어왔다. 데이터 ", result);
      this.status = result;
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    state : RouterStateSnapshot) {
      this.service.isLoggin();
    return this.status;
  }
  
}
