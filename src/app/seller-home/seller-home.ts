import { Component, NgModule } from '@angular/core';
import { authGuard } from '../auth-guard';
import { ProductService } from '../services/product';
import { product } from '../data-type';
import { CommonModule, NgForOf } from '@angular/common';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  standalone:true,
  imports: [NgForOf,FontAwesomeModule,RouterLink],
  templateUrl: './seller-home.html',
  styleUrl: './seller-home.css',
})
export class SellerHome {
  productList:undefined | product[];
  productMessage:undefined | string;
  icon=faTrash;
  iconEdit=faEdit;
  constructor(private product:ProductService){}

  ngOnInit(): void{
   this.list();
  }

  deleteProduct(id:number){
    this.product.deleteProduct(id).subscribe((result)=>{
      if(result){
        this.productMessage = 'Product is deleted';
        this.list();
      }
    });

    setTimeout(()=>{
      this.productMessage=undefined
    }, 3000);
  }

  list(){
    this.product.productList().subscribe((result)=>{
      // console.warn(result);
      if(result){
        this.productList=result;
      }
    });
  }
}
