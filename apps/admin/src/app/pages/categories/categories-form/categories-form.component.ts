import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@hast/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  currentCategoryId: string;
  editmode = false;
  form: FormGroup;
  isSubmitted = false;

  private _endsubs$: Subject<void> = new Subject();

  get categoryForm() {
    return this.form.controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#808080']
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    };

    this.editmode ? this._updateCategory(category) : this._addCategory(category);
  }

  onCancel() {
    this.location.back();
  }

  private _addCategory(category: Category) {
    this.categoriesService
      .createCategory(category)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        (category: Category) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} is created!`
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
            detail: 'Category is not created!'
          });
        }
      );
  }

  private _updateCategory(category: Category) {
    this.categoriesService
      .updateCategory(category)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category is updated!'
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
            detail: 'Category is not updated!'
          });
        }
      );
  }

  private _checkEditMode() {
    this.activatedRoute.params.pipe(takeUntil(this._endsubs$)).subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentCategoryId = params.id;

        this.categoriesService
          .getCategory(params.id)
          .pipe(takeUntil(this._endsubs$))
          .subscribe((category) => {
            this.categoryForm.name.setValue(category.name);
            this.categoryForm.icon.setValue(category.icon);
            this.categoryForm.color.setValue(category.color);
          });
      }
    });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
