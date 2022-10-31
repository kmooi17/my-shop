import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CategoriesService } from '@hast/products';
import { JwtInterceptor, UsersModule } from '@hast/users';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmationService, MessageService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

// TODO: Remove this
import { NgxStripeModule } from 'ngx-stripe';

const UX_MODULE = [
  ButtonModule,
  CardModule,
  ColorPickerModule,
  ConfirmDialogModule,
  DropdownModule,
  EditorModule,
  FieldsetModule,
  InputMaskModule,
  InputNumberModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  TableModule,
  TagModule,
  ToastModule,
  ToolbarModule
];

@NgModule({
  declarations: [
    AppComponent,
    CategoriesFormComponent,
    CategoriesListComponent,
    DashboardComponent,
    OrdersListComponent,
    OrdersDetailComponent,
    ProductsFormComponent,
    ProductsListComponent,
    ShellComponent,
    SidebarComponent,
    UsersFormComponent,
    UsersListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([]),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    UsersModule,
    ...UX_MODULE,
    // TODO: Remove this
    NgxStripeModule.forRoot(
      'pk_test_51LyiMiIX9ERqxQ2tkdrJPOJGobMIl5Wdi4A1fahWW47PukDO0DMsn8wWwc4beI5PGBEZtrzf48s1iuWWhkTHnq2M00YgfUqXUu'
    )
  ],
  providers: [
    CategoriesService,
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
