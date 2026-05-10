import { Component } from '@angular/core';
import { ProductService } from '../services/product';
import { cart, priceSummary } from '../data-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  // cartData: cart[]|undefined;
  cartData: cart[] = [];
  priceSummary:priceSummary={
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0,
  }
  constructor(private product:ProductService, private router:Router){}

  ngOnInit(): void{
    this.loadDetails()
  }


  removeToCart(cartId:number|undefined){
   cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe((result) => {
        this.loadDetails();
  });
  }

  loadDetails(){
        this.product.currentCart().subscribe((result)=>{
      this.cartData=result;
      console.warn(this.cartData);
      let price= 0;
      result.forEach((item)=>{
        if(item.quantity){
          price=price+(+item.price* +item.quantity)
        }
      })
      this.priceSummary.price=price;
      this.priceSummary.discount=price/10;
      this.priceSummary.tax=price/10;
      this.priceSummary.delivery=100;
      this.priceSummary.total=price+(price/10)+100-(price/10);
      // console.warn(this.priceSummary);
      if(!this.cartData.length){
        this.router.navigate(['/']);
      }
    })
  }

  checkout(){
    // console.log("Checkout button clicked!");
    this.router.navigate(['/checkout']);
  }

}
