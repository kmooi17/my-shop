import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-thank-you-page',
  templateUrl: './thank-you.component.html',
  styles: []
})
export class ThankYouComponent implements OnInit, OnDestroy {
  constructor(private orderService: OrdersService, private cartService: CartService) {}

  ngOnInit(): void {
    const orderData = this.orderService.getCacheOrderData();
    if (orderData) {
      this.orderService.sessionId$.subscribe((sessionId: string) => {
        if (sessionId) {
          this.orderService.createOrder(orderData).subscribe(() => {
            this.cartService.emptyCart();
            this.orderService.removeCacheOrderData();
            this.orderService.sessionId$.next(undefined);
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.cartService.emptyCart();
    this.orderService.removeCacheOrderData();
    this.orderService.sessionId$.next(undefined);
  }
}
