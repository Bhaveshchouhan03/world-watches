import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product';
import { product } from '../data-type';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-search',
  imports: [CommonModule,RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  searchResult:undefined| product[]
  constructor(private activeRoute: ActivatedRoute, private product:ProductService, private cd:ChangeDetectorRef){}

  ngOnInit():void{
    // let query = this.activeRoute.snapshot.paramMap.get('query');
    // query && this.product.searchProduct(query).subscribe((result)=>{
    //   this.searchResult=result;
    // })
    this.activeRoute.paramMap.subscribe(params=>{
  let query = params.get('query');
  if(query){
    this.product.searchProduct(query).subscribe((result)=>{
      this.searchResult = result.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
       this.cd.detectChanges();
    });
  }
});
  }
}
