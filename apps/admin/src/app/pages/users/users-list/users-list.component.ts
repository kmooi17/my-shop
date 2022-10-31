import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalstorageService, User, UsersService } from '@hast/users';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: []
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];

  private _endsubs$: Subject<void> = new Subject();

  constructor(
    private confirmationService: ConfirmationService,
    private localstorageService: LocalstorageService,
    private messageService: MessageService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._getUsers();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService
          .deleteUser(userId)
          .pipe(takeUntil(this._endsubs$))
          .subscribe(
            () => {
              this._getUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User is deleted!'
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User is not deleted!'
              });
            }
          );
      }
    });
  }

  updateUser(userid: string) {
    this.router.navigateByUrl(`users/form/${userid}`);
  }

  // TODO: Remove country everywhere
  getCountryName(countryKey: string) {
    if (countryKey) return this.usersService.getCountry(countryKey);
  }

  private _getUsers() {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this._endsubs$))
      .subscribe((users) => {
        const userId = this.localstorageService.getUserIdFromToken();
        this.users = users.filter((user) => user.id !== userId);
      });
  }

  ngOnDestroy() {
    this._endsubs$.next();
    this._endsubs$.complete();
  }
}
