import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cart, login, product, signUp } from '../data-type';
import { User } from '../services/user';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-user-auth',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css',
})
export class UserAuth {
  showLogin:boolean=true;
  authError:string="";
  constructor(private user : User, private product:ProductService){}

  ngOnInit():void{
    this.user.userAuthReload();
  }

  SignUp(data:signUp){
    this.user.userSignUp(data);
  }
  
  login(data:login){
      console.log("INPUT:", data);
    data.email = data.email.trim();
  data.password = data.password.toString().trim();
   this.user.userLogin(data);
   this.user.invalidUserAuth.subscribe((result)=>{
    console.warn(result);
    if(result){
      this.authError="user not found"
    }else{
      this.localCartToRemoteCart();
    }
   })
  }

  openSignUp(){
    this.showLogin=false;
  }

  openLogin(){
    this.showLogin=true;
  }

  localCartToRemoteCart(){
    // console.warn("called");
    let data = localStorage.getItem('localCart');
     let user = localStorage.getItem('user');
      let userData = user && JSON.parse(user);
      let userId= userData?.id ?? userData?.userId;
    if(data){
      let cartDataList:product[]=JSON.parse(data);
     
      cartDataList.forEach((product:product, index)=>{
        let cartData:cart={
          ...product,
          productId:product.id,
          userId
        }
        delete cartData.id;
       setTimeout(()=>{
         this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            console.warn("data is stored in DB");
          }
        })
      }, 500);
        if(cartDataList.length===index+1){
          localStorage.removeItem('localCart')
        }
      })
    }
   setTimeout(() => {
    this.product.getCartList(userId)
   }, 2000);
  }
}
