import { Component, NgModule } from '@angular/core';
import { ProductService } from '../services/product';
import { order } from '../data-type';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-my-order',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})
export class MyOrder {

  orderData: order[] = [];
  constructor(private product:ProductService){}

  ngOnInit():void{
    this.getOrderList();
  }

  cencelOrder(orderId:number|undefined){
    orderId && this.product.cencelOrder(orderId).subscribe((result)=>{
      if(result){
        this.getOrderList();
      }
    })
  }

  getOrderList(){
    this.product.orderList().subscribe((result)=>{
      this.orderData=result;
    })
  }
}
