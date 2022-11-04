import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'users-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  authError = false;
  authMessage = 'Please fill in all the details';
  isSubmitted = false;
  registerFormGroup: FormGroup;

  get registerForm() {
    return this.registerFormGroup.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this._initRegisterForm();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.registerFormGroup.invalid) return;

    const user: User = {
      name: this.registerForm.name.value,
      email: this.registerForm.email.value,
      phone: this.registerForm.phone.value,
      password: this.registerForm.password.value
    };

    this.authService.register(user).subscribe(
      () => {
        this.authError = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Registered successfully, please login to continue.`
        });

        timer(2000)
          .toPromise()
          .then(() => {
            this.router.navigate(['/login']);
          });
      },
      (error: HttpErrorResponse) => {
        this.authError = true;
        if (error.status !== 400) {
          this.authMessage = 'Error occured in the server, please try again later.';
        }

        console.error(error);
      }
    );
  }

  private _initRegisterForm() {
    this.registerFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
