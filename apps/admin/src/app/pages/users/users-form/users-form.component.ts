import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService, User } from '@hast/users';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: []
})
export class UsersFormComponent implements OnInit, OnDestroy {
  countries = [];
  currentUserId: string;
  editmode = false;
  form: FormGroup;
  isSubmitted = false;

  private _endsubs$: Subject<void> = new Subject();

  get userForm() {
    return this.form.controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private messageService: MessageService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      password: this.userForm.password.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    };

    this.editmode ? this._updateUser(user) : this._addUser(user);
  }

  onCancel() {
    this.location.back();
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _addUser(user: User) {
    this.usersService
      .createUser(user)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        (user: User) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${user.name} is created!`
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
            detail: 'User is not created!'
          });
        }
      );
  }

  private _updateUser(user: User) {
    this.usersService
      .updateUser(user)
      .pipe(takeUntil(this._endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is updated!'
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
            detail: 'User is not updated!'
          });
        }
      );
  }

  private _checkEditMode() {
    this.activatedRoute.params.pipe(takeUntil(this._endsubs$)).subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentUserId = params.id;

        this.usersService
          .getUser(params.id)
          .pipe(takeUntil(this._endsubs$))
          .subscribe((user) => {
            this.userForm.name.setValue(user.name);
            this.userForm.email.setValue(user.email);
            this.userForm.phone.setValue(user.phone);
            this.userForm.isAdmin.setValue(user.isAdmin);
            this.userForm.street.setValue(user.street);
            this.userForm.apartment.setValue(user.apartment);
            this.userForm.zip.setValue(user.zip);
            this.userForm.city.setValue(user.city);
            this.userForm.country.setValue(user.country);

            this.userForm.password.setValidators([]);
            this.userForm.password.updateValueAndValidity();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
