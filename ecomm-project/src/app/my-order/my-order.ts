import { Component, NgModule } from '@angular/core';
import { ProductService } from '../services/product';
import { order } from '../data-type';
import { CommonModule, NgFor } from '@angular/common';
import { NgForm, NgModel } from '@angular/forms';


@Component({
  selector: 'app-my-order',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})
export class MyOrder {

  orderData: order[] = [];
  // orderData:order[]|undefined
  constructor(private product:ProductService){}

  ngOnInit():void{
    this.getOrderList();
  }

  cencelOrder(orderId:number|undefined){
    console.warn("cencelOrder");
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
