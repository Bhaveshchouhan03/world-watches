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
      if (query.startsWith('ids:')) {
        const ids = query.replace('ids:', '').split(',').map(id => Number(id));
        this.searchResult = result.filter(item => ids.includes(item.id));
      } else {
        const q = query.toLowerCase();
        // Filter out common stop words to get meaningful keywords
        const stopWords = ['show', 'me', 'list', 'product', 'products', 'want', 'buy', 'looking', 'some', 'for', 'the', 'and', 'with'];
        const queryWords = q.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
        
        this.searchResult = result.filter(item => {
          const name = item.name.toLowerCase();
          const category = item.category.toLowerCase();
          
          // Exact match first
          if (name.includes(q) || category.includes(q)) return true;
          
          // If no exact match, check if any meaningful keyword matches
          if (queryWords.length > 0) {
             return queryWords.some(word => name.includes(word) || category.includes(word));
          }
          return false;
        });
      }
       this.cd.detectChanges();
    });
  }
});
  }
}
