import { Component, OnDestroy, OnInit } from '@angular/core';

import { OrdersService } from '@hast/orders';
import { ProductsService } from '@hast/products';
import { UsersService } from '@hast/users';

import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = [];

  private _endsubs$: Subject<void> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private productService: ProductsService,
    private userService: UsersService
  ) {}

  // TODO: Add feedback count
  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ])
      .pipe(takeUntil(this._endsubs$))
      .subscribe((values) => {
        this.statistics = values;
      });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
