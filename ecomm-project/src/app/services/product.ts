import { Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core'; 
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // cartData = new EventEmitter<product[] |[]>();
  cartData = new BehaviorSubject<product[]>([]);
  private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getCurrentUserId(): number | undefined {
    const userStore = localStorage.getItem('user');

    if (!userStore || userStore === 'undefined') {
      return undefined;
    }

    const userData = JSON.parse(userStore);
    return userData?.id ?? userData?.userId;
  }


  addProduct(data:product){
  return this.http.post(`${this.apiUrl}/products`,data);
  }
  productList(){
    return this.http.get <product[]> (`${this.apiUrl}/products`);
  }

  deleteProduct(id:number){
    return this.http.delete(`${this.apiUrl}/products/${id}`)
  }

  getProduct(id:string){
    return this.http.get<product>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(product:product){
    return this.http.put<product>(`${this.apiUrl}/products/${product.id}`,product)
  }

  popularProducts() {
   return this.http.get<product[]>(`${this.apiUrl}/products`);
  }

  trendyProducts(){
     return this.http.get<product[]>(`${this.apiUrl}/products`);
  }
  
  searchProduct(query: string) {
  return this.http.get<product[]>(`${this.apiUrl}/products`);
  }

  localAddToCart(data: product) {
  let cartData: product[] = [];
  let localCart = localStorage.getItem('localCart');
  if (!localCart) {
    cartData = [data];
     this.cartData.next([data]);
  } else {
    cartData = JSON.parse(localCart);
    cartData.push(data);
  }
  localStorage.setItem('localCart', JSON.stringify(cartData));

  this.cartData.next(cartData); // optional
  }


  removeItemFromCart(productId:number){
    let cartData = localStorage.getItem('localCart');
    if(cartData){
      let items:product[] = JSON.parse(cartData);
      items = items.filter((item:product)=>productId!==item.id)
       localStorage.setItem('localCart', JSON.stringify(items));
       this.cartData.next(items);
    }
  }

  addToCart(cartData:cart){
     return this.http.post(`${this.apiUrl}/cart`,cartData);
  }

  getCartList(userId:number){
      return this.http.get<product[]>(`${this.apiUrl}/cart?userId=`+userId,{
        observe:'response'
      }).subscribe((result)=>{
        if(result && result.body){
          this.cartData.next(result.body);
        }
      })
  }

  

  removeToCart(cartId:number){
    return this.http.delete(`${this.apiUrl}/cart/`+cartId);
  }

  currentCart(){
    const userId = this.getCurrentUserId();
    return this.http.get<cart[]>(`${this.apiUrl}/cart?userId=`+userId);
  }

  orderNow(data:order){
     return this.http.post(`${this.apiUrl}/orders`,data);
  }

  // orderList(){
  // return this.http.get<order[]>("${this.apiUrl}/orders");
  // }
  orderList() {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return of([] as order[]);
    }

    return this.http.get<order[]>(`${this.apiUrl}/orders?userId=${userId}`);
  }

  deleteCartItems(cartId:number){
     return this.http.delete(`${this.apiUrl}/cart/`+cartId).subscribe((reslut)=>{
      this.cartData.next([]);
     })
  }

  cencelOrder(orderId:number){
    return this.http.delete(`${this.apiUrl}/orders/`+orderId);
  }
}
