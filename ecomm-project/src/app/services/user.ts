import { EventEmitter, Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class User {
  invalidUserAuth = new EventEmitter<boolean>(false);
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router ){}
  userSignUp(user:signUp){
   this.http.post(`${this.apiUrl}/users`,user,{observe:'response'})
   .subscribe((result)=>{
    if(result){
      const createdUser = {
        ...user,
        id: (result.body as any)?.userId,
      };
      localStorage.setItem('user',JSON.stringify(createdUser));
      this.router.navigate(['/']);
    }
  })
  }

userLogin(data:login){
  this.http.get<signUp[]>(
    `${this.apiUrl}/users`,
    {observe:'response'}
  ).subscribe((result)=>{

    const users = result.body || [];

    const match = users.find((user:any)=>
      user.email.trim().toLowerCase() === data.email.trim().toLowerCase() &&
      user.password.toString().trim() === data.password.toString().trim()
    );

    console.log("MATCH:", match); // 🔥

    if(match){
      localStorage.setItem('user',JSON.stringify(match));
      this.router.navigate(['/']);
      this.invalidUserAuth.emit(false);
    }else{
      this.invalidUserAuth.emit(true);
    }
  })
}



  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }
}
