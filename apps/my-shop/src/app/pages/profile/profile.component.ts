import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UsersService } from '@hast/users';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'my-shop-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUserId: string;
  form: FormGroup;
  isSubmitted = false;

  private _endsubs$: Subject<void> = new Subject();

  get userForm() {
    return this.form.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._initUserForm();
    this._autofillProfile();
  }

  updateProfile() {
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

    this._updateUser(user);
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

  private _autofillProfile() {
    this.usersService
      .observeCurrentUser()
      .pipe(takeUntil(this._endsubs$))
      .subscribe((user) => {
        if (user) {
          this.currentUserId = user.id;

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
        }
      });
  }

  private _updateUser(user: User) {
    const updatedUser = this.usersService.updateUser(user);

    this.usersService.setUserFacade(updatedUser);

    updatedUser.pipe(takeUntil(this._endsubs$)).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile is updated!'
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update Profile!'
        });
      }
    );
  }

  ngOnDestroy(): void {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
