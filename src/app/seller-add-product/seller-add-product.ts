import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ProductService } from '../services/product';
// import { ProductService } from '../services/product.service';
import { product } from '../data-type';
@Component({
  selector: 'app-seller-add-product',
  imports: [CommonModule,FormsModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css',
})
export class SellerAddProduct {
  addProductMessage:string|undefined;
  constructor(private productService: ProductService) {}

  ngOnInit():void{

  }

  submit(data:product){
    // console.warn();
    this.productService.addProduct(data).subscribe((result)=>{
      // console.warn(result);
      if(result){
        this.addProductMessage="Product is added successfully";
      }
    });
    setTimeout(()=>{
      this.addProductMessage=undefined
    });
  }
}
