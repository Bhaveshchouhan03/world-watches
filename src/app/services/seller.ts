import { Injectable , EventEmitter } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { login, signUp } from '../data-type';
// import { subscribe } from 'diagnostics_channel';
import { BehaviorSubject } from 'rxjs';
import { Router } from  '@angular/router';
import { environment } from '../../environments/environment';
// import { EventEmitter } from 'node:stream';

@Injectable({
  providedIn: 'root',
})
export class Seller {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false)
  private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient, private router:Router){}
  userSignUp(data:signUp){
    this.http.post(`${this.apiUrl}/seller`,
      data,
      {observe:'response'}).subscribe((result)=>{
      if(result){
        // this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller',JSON.stringify(result.body))
        this.router.navigate(['seller-home'])
      }
    })
  }
  reloadSeller(){
    if(localStorage.getItem('seller')){
      this.isSellerLoggedIn.next(true)
      this.router.navigate(['seller-home'])
    }
  }

  userLogin(data:login){
    this.http.get(`${this.apiUrl}/seller?email=${data.email}&password=${data.password}`,
      
    { observe: 'response' }).subscribe((result:any)=>{
      if(result && result.body && result.body.length===1){
        this.isLoginError.emit(false);
         localStorage.setItem('seller',JSON.stringify(result.body[0]));
        this.router.navigate(['seller-home']);
      }else{
        this.isLoginError.emit(true);
      }
    });
  }
}
