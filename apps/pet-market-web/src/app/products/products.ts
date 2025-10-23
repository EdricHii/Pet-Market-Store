import { afterNextRender, Component, inject } from '@angular/core';
import { ProductStore } from '../stores/product.store';
import { ProductCard } from '../components/product-card/product-card';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import untilDestroyed from '../utils/untilDestroyed';
import { CartStore } from '../stores/cart.store';
import { Product } from '@prisma/client';

@Component({
  selector: 'app-products',
  imports: [ProductCard, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent {
  searchTerm = '';
  productstore = inject(ProductStore);
  cartStore = inject(CartStore);
  searchSubject = new Subject<string>();
  destroyed = untilDestroyed();

  constructor() {
    this.productstore.loadProducts();
    afterNextRender(() => {
      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        this.destroyed()
      ).subscribe((term) => {
        console.log({ term });
        this.productstore.searchProducts(term);
      });
    });
  }
  onSearch(term: string) {
    this.searchSubject.next(term);
  }
  addToCart(product: Product) {
    this.cartStore.addToCart(product);
  }
}

