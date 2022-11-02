import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@hast/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: []
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  catagories = [];
  currentProductId: string;
  editmode = false;
  form: FormGroup;
  imageDisplay: string | ArrayBuffer;
  isSubmitted = false;

  private _endsubs$: Subject<void> = new Subject();

  get productForm() {
    return this.form.controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private location: Location,
    private messageService: MessageService,
    private productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });

    this.editmode ? this._updateProduct(productFormData) : this._addProduct(productFormData);
  }

  onCancel() {
    this.location.back();
  }

  onImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();

      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };

      fileReader.readAsDataURL(file);
    }
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this._endsubs$))
      .subscribe((categories) => {
        this.catagories = categories;
      });
  }

  private _addProduct(productData: FormData) {
    this.productsService
      .createProduct(productData)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        (product: Product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is created!`
          });
          timer(1000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not created!'
          });
        }
      );
  }

  private _updateProduct(productFormData: FormData) {
    this.productsService
      .updateProduct(productFormData, this.currentProductId)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product is updated!'
          });
          timer(1000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated!'
          });
        }
      );
  }

  private _checkEditMode() {
    this.activatedRoute.params.pipe(takeUntil(this._endsubs$)).subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.productsService
          .getProduct(params.id)
          .pipe(takeUntil(this._endsubs$))
          .subscribe((product) => {
            this.productForm.name.setValue(product.name);
            this.productForm.category.setValue(product.category.id);
            this.productForm.brand.setValue(product.brand);
            this.productForm.price.setValue(product.price);
            this.productForm.countInStock.setValue(product.countInStock);
            this.productForm.isFeatured.setValue(product.isFeatured);
            this.productForm.description.setValue(product.description);
            this.productForm.richDescription.setValue(product.richDescription);
            this.imageDisplay = product.image;
            this.productForm.image.setValidators([]);
            this.productForm.image.updateValueAndValidity();
          });
      }
    });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
