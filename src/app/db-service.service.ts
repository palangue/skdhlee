import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private readonly myStorage = {
    id : 'admin',
    password : '1234'
  }

  // 로그인 여부
  public IsLogged : BehaviorSubject<any> = new BehaviorSubject(false);

  // 뭐할 때 썼을까?
  private IsValidPromoCode : BehaviorSubject<any> = new BehaviorSubject({});
  public readonly promo_scription : Observable<any> = this.IsValidPromoCode.asObservable();


  public addData(arg : boolean, loginInformation? : any) : void {
    if(arg)
    {
      this.IsValidPromoCode.next(loginInformation);
    }
  }

  // 관리자 로그인을 시도하는 함수
  tryToLogin(param : any){
    console.log('tryToLogin()');
    return new Observable( arg=>{  //관측대상 생성
      console.log('localstorage before = ' , localStorage);
      if(param.id == this.myStorage.id && param.password == this.myStorage.password){  //로그인 정보가 맞다면
        arg.next({status: true});  //성공
        localStorage.setItem('status',"true");  //로컬저장소에 저장!
      } else {
        console.log('로그인 실패');
        arg.next({status: false, reason : 'wrong information'});  //실패
      }

      console.log('localstorage before = ' , localStorage);
      arg.complete();
    });
  }

  // 관리자 로그인 돼어 있는지 확인
  isLoggin() : void {
    if(localStorage.getItem('status') == 'true'){
      this.IsLogged.next(true);
    }
    else{
      this.IsLogged.next(false);
    }
  }


}
