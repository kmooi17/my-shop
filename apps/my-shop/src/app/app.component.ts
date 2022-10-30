import { Component, OnInit } from '@angular/core';
import { UsersService } from '@hast/users';

@Component({
  selector: 'my-shop-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'my-shop';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.initAppSession();
  }
}
