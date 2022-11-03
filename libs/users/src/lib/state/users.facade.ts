import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
  private _currentUser$ = this.store.pipe(select(UsersSelectors.getUser));
  public get currentUser$() {
    return this._currentUser$;
  }
  public set currentUser$(value) {
    this._currentUser$ = value;
  }

  isAuthenticated$ = this.store.pipe(select(UsersSelectors.getUserIsAuth));

  constructor(private store: Store) {}

  buildUserSession() {
    this.store.dispatch(UsersActions.buildUserSession());
  }
}
