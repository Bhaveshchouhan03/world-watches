import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    const userId = userData?.id ?? userData?.userId;

    if(this.totalPrice && userId){
      const orderData:order={
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id:undefined
      }
      this.product.orderNow(orderData).subscribe({
        next: (result)=>{
          if(result){
            this.product.cartData.next([]);
            this.orderMsg="order has been placed";
            this.router.navigate(['/my-orders']);
            alert('Order placed');
          }
        },
        error: ()=>{
          this.orderMsg="Unable to place order. Please try again.";
        }
      })
    }
  }
  
}
