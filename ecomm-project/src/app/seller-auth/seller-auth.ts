import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seller } from '../services/seller';
import { login, signUp } from '../data-type';
import { Router } from  '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  // providers: [Seller],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css',
})
export class SellerAuth {
  // showLogin=true
  showLogin:boolean=false;
  authError:string='';
  constructor(private seller:Seller, private router: Router){}

  ngOnInit(): void{
    this.seller.reloadSeller();
  }
 signUp(data: signUp): void { 
  this.seller.userSignUp(data);
}
 login(data: login): void { 
  this.seller.userLogin(data);
  // this.seller.isLoginError.subscribe((isError)=>{
  //   if(isError){
  //     this.authError="name or password is not correct";
  //   }
  // });
  this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Name or password is not correct";
      } else {
        this.authError = "";
      }
    });
}

openLogin(){
  this.showLogin=true;
}
openSignUp(){
  this.showLogin=false;
  
}
}
