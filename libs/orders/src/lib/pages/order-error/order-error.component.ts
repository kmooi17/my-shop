import { Component, OnDestroy } from '@angular/core';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-order-error',
  templateUrl: './order-error.component.html',
  styleUrls: ['./order-error.component.scss']
})
export class OrderErrorComponent implements OnDestroy {
  constructor(private orderService: OrdersService) {}

  ngOnDestroy(): void {
    this.orderService.removeCacheOrderData();
    this.orderService.sessionId$.next(undefined);
  }
}
