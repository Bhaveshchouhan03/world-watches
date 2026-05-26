import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  imports: [CommonModule,FormsModule],
  templateUrl: './seller-update-product.html',
  styleUrl: './seller-update-product.css',
})
export class SellerUpdateProduct {
  productData:undefined | product;
  productMessage:undefined | string;
  constructor(private router:ActivatedRoute,private product:ProductService){}

  ngOnInit():void{
    let productId= this.router.snapshot.paramMap.get('id')
    productId && this.product.getProduct(productId).subscribe((data:any)=>{
      this.productData=data;
    })
  }

  submit(data:any){
    if(this.productData){
      data.id=this.productData.id;
    }
    this.product.updateProduct(data).subscribe((result)=>{
      if(result){
        this.productMessage="Product hes updated"
      }
    })
    setTimeout(()=>{
      this.productMessage=undefined;
    })
  }
}
