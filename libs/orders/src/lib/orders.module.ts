import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { OrderErrorComponent } from './pages/order-error/order-error.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { CartService } from './services/cart.service';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { AuthGuard } from '@hast/users';

const routes: Routes = [
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    component: CheckoutPageComponent
  },
  {
    path: 'success',
    canActivate: [AuthGuard],
    component: ThankYouComponent
  },
  {
    path: 'error',
    component: OrderErrorComponent
  }
];
@NgModule({
  imports: [
    BadgeModule,
    ButtonModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    InputMaskModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [
    CartIconComponent,
    CartPageComponent,
    CheckoutPageComponent,
    OrderErrorComponent,
    OrderSummaryComponent,
    ThankYouComponent
  ],
  exports: [CartIconComponent, CartPageComponent, OrderSummaryComponent]
})
export class OrdersModule {
  constructor(cartService: CartService) {
    cartService.initCartLocalStorage();
  }
}
