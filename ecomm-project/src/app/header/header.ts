import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../services/product';
import { product } from '../data-type';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartData = new BehaviorSubject<product[]>([]);
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: product[] = [];
  cartItems = 0;

  constructor(
    private route: Router,
    private product: ProductService,
  ) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          const sellerStore = localStorage.getItem('seller');
          const sellerData = sellerStore && JSON.parse(sellerStore);
          this.sellerName = sellerData.name;
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          const userStore = localStorage.getItem('user');
          if (userStore && userStore !== 'undefined') {
            const userData = JSON.parse(userStore);
            this.userName = userData?.name || '';
            this.menuType = 'user';
            this.product.getCartList(userData.id);
          } else {
            localStorage.removeItem('user');
            this.menuType = 'default';
          }
        } else {
          this.menuType = 'default';
        }
      }
    });

    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }

    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.next([]);
  }

  searchProduct(query: KeyboardEvent) {
    const element = query.target as HTMLInputElement;
    const term = element.value.trim().toLowerCase();

    if (term) {
      this.product.searchProduct(element.value).subscribe((result) => {
        this.searchResult = result
          .filter(
            (item) =>
              item.name.toLowerCase().includes(term) ||
              item.category.toLowerCase().includes(term) ||
              item.color.toLowerCase().includes(term),
          )
          .sort((first, second) => this.getSearchScore(second, term) - this.getSearchScore(first, term))
          .slice(0, 4);
      });
    } else {
      this.searchResult = [];
    }
  }

  getSearchScore(item: product, term: string) {
    const name = item.name.toLowerCase();
    const category = item.category.toLowerCase();
    const color = item.color.toLowerCase();

    if (name.startsWith(term)) {
      return 3;
    }

    if (category.startsWith(term) || color.startsWith(term)) {
      return 2;
    }

    return 1;
  }

  hideSearch() {
    setTimeout(() => {
      this.searchResult = [];
    }, 200);
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }

  goToCart() {
    if (this.cartItems > 0 || this.menuType === 'user') {
      this.route.navigate(['/cart-page']);
      return;
    }

    this.route.navigate(['/user-auth']);
  }
}
