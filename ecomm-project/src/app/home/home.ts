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
  filter: string = '';

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data) => {
      const titanWatches = data.filter(p => p.name.toLowerCase().includes('titan')).slice(0, 2);
      
      const allRolex = data.filter(p => p.name.toLowerCase().includes('rolex'));
      const preferredRolex = allRolex.filter(p => p.name.toLowerCase().includes('datejust'));
      const otherRolex = allRolex.filter(p => !p.name.toLowerCase().includes('datejust') && !p.name.toLowerCase().includes('yacht-master'));
      const rolexWatches = [...preferredRolex.slice(0, 1), ...otherRolex.slice(0, 1)];
      
      this.popularProducts = [...titanWatches, ...rolexWatches];
      if (this.featuredIndex >= this.popularProducts.length) {
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

  setFilter(brand: string) {
    this.filter = brand;
  }

  get heroStats() {
    return [
      { value: `${this.popularProducts?.length || 0}+`, label: 'Featured products' },
      { value: `${this.trendyProducts?.length || 0}+`, label: 'Trending picks' },
      { value: '24/7', label: 'Checkout ready' },
    ];
  }

  get brands(): string[] {
    if (!this.trendyProducts) return [];
    const brandSet = new Set<string>();
    this.trendyProducts.forEach(p => {
      const name = p.name.toLowerCase();
      if (name.includes('titan')) brandSet.add('Titan');
      if (name.includes('rolex')) brandSet.add('Rolex');
      // Add more brand detections as needed
    });
    return Array.from(brandSet);
  }

  get displayedProducts() {
    if (this.filter === 'Titan') {
      return this.trendyProducts?.filter(p => p.name.toLowerCase().includes('titan')) || [];
    } else if (this.filter === 'Rolex') {
      return this.trendyProducts?.filter(p => p.name.toLowerCase().includes('rolex')) || [];
    } else {
      return this.trendyProducts?.slice(0, 8) || [];
    }
  }
}
