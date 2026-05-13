import { EventEmitter, Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class User {
  invalidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router ){}
  userSignUp(user:signUp){
   this.http.post('http://10.104.164.161:5000/users',user,{observe:'response'})
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

  // userLogin(data:login){
  //   this.http.get<signUp[]>(`http://10.104.164.161:5000/users?email=${data.email}&password=${data.password}`,
  //   {observe:'response'}
  //   ).subscribe((result)=>{
  //     if(result && result.body?.length){
  //      console.log("RESULT:", result.body);
  //       localStorage.setItem('user',JSON.stringify(result.body[0]));
  //       this.router.navigate(['/']);
  //       this.invalidUserAuth.emit(false);
  //     }else{
  //       this.invalidUserAuth.emit(true);
  //     }
  //   })
  // }


userLogin(data:login){
  this.http.get<signUp[]>(
    `http://10.104.164.161:5000/users`,
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
