import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { warn } from 'console';
import { ProductService } from '../services/product';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  totalPrice:number|undefined;
  cartData:cart[]|undefined;
  orderMsg:string|undefined;
  constructor(private product:ProductService, private router:Router){}

  ngOnInit(): void{
    this.product.currentCart().subscribe((result)=>{
      let price= 0;
      this.cartData=result;
      result.forEach((item)=>{
        if(item.quantity){
          price=price+(+item.price* +item.quantity)
        }
      })
      this.totalPrice=price+(price/10)+100-(price/10);
      console.warn(this.totalPrice);
    })
  }

  orderNow(data:{email:string,address:string,contact:string}){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user);
    if(this.totalPrice){
      let orderData:order={
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id:undefined
      }
      this.cartData?.forEach((item)=>{
       setTimeout(() => {
         item.id && this.product.deleteCartItems(item.id)
       }, 500);
      })
      this.product.orderNow(orderData).subscribe((result)=>{
        if(result){
          this.orderMsg="order has been placed";
          this.router.navigate(['/my-orders'])
          // setTimeout(() => {
          //   this.orderMsg=undefined;
          // }, 4000);
          alert('Order placed')
        }
      })
    }
  }
  
}
