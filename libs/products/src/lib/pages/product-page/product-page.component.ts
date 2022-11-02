import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@hast/orders';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: []
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: Product;
  quantity = 1;

  private _endSubs$: Subject<void> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private prodService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.productid) {
        this._getProduct(params.productid);
      }
    });
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this.cartService.setCartItem(cartItem);
  }

  private _getProduct(id: string) {
    this.prodService
      .getProduct(id)
      .pipe(takeUntil(this._endSubs$))
      .subscribe((resProduct) => {
        this.product = resProduct;
      });
  }

  ngOnDestroy(): void {
    this._endSubs$.next();
    this._endSubs$.complete();
  }
}
