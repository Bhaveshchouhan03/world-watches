import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../services/product';
import { product } from '../data-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  featuredIndex = 0;

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data) => {
      this.popularProducts = data;
      if (this.featuredIndex >= data.length) {
        this.featuredIndex = 0;
      }
    });

    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });
  }

  get featuredProduct() {
    return this.popularProducts?.[this.featuredIndex];
  }

  previousFeatured() {
    if (!this.popularProducts?.length) {
      return;
    }

    this.featuredIndex =
      (this.featuredIndex - 1 + this.popularProducts.length) % this.popularProducts.length;
  }

  nextFeatured() {
    if (!this.popularProducts?.length) {
      return;
    }

    this.featuredIndex = (this.featuredIndex + 1) % this.popularProducts.length;
  }

  selectFeatured(index: number) {
    this.featuredIndex = index;
  }

  get heroStats() {
    return [
      { value: `${this.popularProducts?.length || 0}+`, label: 'Featured products' },
      { value: `${this.trendyProducts?.length || 0}+`, label: 'Trending picks' },
      { value: '24/7', label: 'Checkout ready' },
    ];
  }

  get displayedProducts() {
    return this.trendyProducts?.slice(0, 8) || [];
  }
}
