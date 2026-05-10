import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product';
import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../services/user';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  productData: undefined | product;
  productQuantity:number=1;
  removeCart=false;
  cartData:product|undefined;
  constructor(private activeRoute:ActivatedRoute, private product:ProductService,private cd: ChangeDetectorRef){}


  ngOnInit(): void {
   this.activeRoute.params.subscribe((params) => {
    let productId = params['productId'];
    if (productId) {
      this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;
        this.cd.detectChanges();
        let cartData = localStorage.getItem('localCart');
        if(productId && cartData){
          let items =JSON.parse(cartData);
          items = items.filter((items:product)=>productId === items.id.toString());
          // console.warn("items",items);
          if(items.length){
            this.removeCart=true;
          }else{
            this.removeCart=false
          }
        }

         let user = localStorage.getItem('user');
         if(user){
            let userId = user && JSON.parse(user).id;
            this.product.getCartList(userId);
            this.product.cartData.subscribe((result)=>{
              let item = result.filter((item:product)=>productId?.toString()===item.productId?.toString())
              if(item.length){
                this.cartData=item[0];
                this.removeCart=true;
              }
            })
         }

      });
    }
    });
  }


  handleQuantity(val:string){
    if(this.productQuantity<20 && val==='plus'){
      this.productQuantity+=1;
    }else if(this.productQuantity>1 && val==='min'){
      this.productQuantity-=1;
    }
  }

  // addToCart(){
  // console.log("CLICKED");
  // if(this.productData){
  //   this.productData.quantity = this.productQuantity;
  //   console.log("ADDING:", this.productData);
  //   if(localStorage.getItem('user')){
  //   this.product.localAddToCart(this.productData);
  //   this.removeCart=true;
  // }else{
  //   console.warn("user is logged in");
  //   let user = localStorage.getItem('user');
  //   let userId = user && JSON.parse(user).id;
  //   console.warn(userId);
  //   let cartData:cart={
      
  //     ...this.productData,
  //     productId:this.productData.id,
  //     userId
  //   }
  //   delete cartData.id;
  //   console.warn(cartData);
  //   this.product.addToCart(cartData).subscribe((result)=>{
  //     if(result){
  //       // alert("Product is added in cart")
  //       this.product.getCartList(userId);
  //       this.removeCart=true
  //     }
  //   })
  // }
  // }
  // }


  addToCart() {
  if (this.productData) {
    this.productData.quantity = this.productQuantity;
    let user = localStorage.getItem('user');

    if (!user) {
      // Guest User logic
      this.product.localAddToCart(this.productData);
      this.removeCart = true;
      // Forcefully telling Angular to update UI
      this.cd.markForCheck(); 
      this.cd.detectChanges();
    } else {
      // Logged in User logic
      let userId = JSON.parse(user).id;
      let cartData: cart = {
        ...this.productData,
        productId: this.productData.id,
        userId
      };
      delete cartData.id;

      this.product.addToCart(cartData).subscribe((result) => {
        if (result) {
          this.removeCart = true;
          this.product.getCartList(userId);
          // Subscribe ke andar detectChanges hona bahut zaroori hai
          this.cd.markForCheck();
          this.cd.detectChanges();
        }
      });
    }
  }
}

  
  // removeToCart(productId:number){
  //    if(localStorage.getItem('user')){
  //   this.product.removeItemFromCart(productId)
  //   }else{
  //     console.warn("cartData", this.cartData);
  //    this.cartData && this.product.removeToCart(this.cartData.id)
  //    .subscribe((result)=>{
  //      let user = localStorage.getItem('user');
  //     let userId = user && JSON.parse(user).id;
  //     this.product.getCartList(userId)
  //    })
  //   }
  //   this.removeCart=false;
  // }


  removeToCart(productId: number) {
  let user = localStorage.getItem('user');
  
  if (!user) {
    this.product.removeItemFromCart(productId);
    this.removeCart = false;
    this.cd.detectChanges();
  } else {
    this.cartData && this.product.removeToCart(this.cartData.id)
      .subscribe((result) => {
        let userLocal = localStorage.getItem('user');
        let userId = JSON.parse(userLocal!).id;
        this.product.getCartList(userId);
        this.removeCart = false;
        this.cd.detectChanges();
      });
  }
}

  get descriptionPoints() {
    return this.productData?.description
      ?.split('\n')
      .map((point) => point.trim())
      .filter((point) => point)
      .slice(0, 6) || [];
  }

  get productSummary() {
    return this.descriptionPoints.slice(0, 3).join(' ');
  }

  resolveColor(color: string) {
    const normalized = color.trim().toLowerCase();
    const colorMap: Record<string, string> = {
      black: '#090909',
      blue: '#6fa9df',
      'blue,white': 'linear-gradient(135deg, #4b78b0 0%, #4b78b0 50%, #ffffff 50%, #ffffff 100%)',
      'natural silver': '#c6cdd8',
      silver: '#c6cdd8',
      seashell: '#f3ddd2',
      'summit red': '#b0323f',
    };

    return colorMap[normalized] || normalized || '#1b1b1b';
  }


 
}
