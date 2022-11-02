import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MessagesComponent } from './shared/messages/messages.component';
import { NavComponent } from './shared/nav/nav.component';

import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { OrdersModule } from '@hast/orders';
import { ProductsModule } from '@hast/products';
import { UiModule } from '@hast/ui';
import { JwtInterceptor, UsersModule } from '@hast/users';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// TODO: Remove this
import { NgxStripeModule } from 'ngx-stripe';

const routes: Routes = [{ path: '', component: HomePageComponent }];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    FooterComponent,
    MessagesComponent,
    NavComponent
  ],
  imports: [
    AccordionModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([]),
    HttpClientModule,
    OrdersModule,
    ProductsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({}),
    ToastModule,
    UiModule,
    UsersModule,
    // TODO: Remove this
    NgxStripeModule.forRoot(
      'pk_test_51LyiMiIX9ERqxQ2tkdrJPOJGobMIl5Wdi4A1fahWW47PukDO0DMsn8wWwc4beI5PGBEZtrzf48s1iuWWhkTHnq2M00YgfUqXUu'
    )
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
