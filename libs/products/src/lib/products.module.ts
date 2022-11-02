import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { OrdersModule } from '@hast/orders';
import { UiModule } from '@hast/ui';

import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';

const PRODUCTS_COMPONENTS = [
  CategoriesBannerComponent,
  FeaturedProductsComponent,
  ProductItemComponent,
  ProductPageComponent,
  ProductsListComponent,
  ProductsSearchComponent
];

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'category/:categoryid',
    component: ProductsListComponent
  },
  {
    path: 'products/:productid',
    component: ProductPageComponent
  }
];

@NgModule({
  imports: [
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    InputNumberModule,
    OrdersModule,
    RatingModule,
    RouterModule.forChild(routes),
    UiModule
  ],
  declarations: [PRODUCTS_COMPONENTS],
  exports: [PRODUCTS_COMPONENTS]
})
export class ProductsModule {}
