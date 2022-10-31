import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@hast/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products = [];

  private _endsubs$: Subject<void> = new Subject();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getProducts();
  }

  updateProduct(productid: string) {
    this.router.navigateByUrl(`products/form/${productid}`);
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService
          .deleteProduct(productId)
          .pipe(takeUntil(this._endsubs$))
          .subscribe(
            () => {
              this._getProducts();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product is deleted!'
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product is not deleted!'
              });
            }
          );
      }
    });
  }

  private _getProducts() {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this._endsubs$))
      .subscribe((products) => {
        this.products = products;
      });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
