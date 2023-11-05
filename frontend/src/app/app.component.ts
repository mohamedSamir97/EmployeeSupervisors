import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './models/user';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   /** spinner starts on init */
  //   // this.spinner.show();

  //   // setTimeout(() => {
  //   //   /** spinner ends after 5 seconds */
  //   //   this.spinner.hide();
  //   // }, 5000);
  // }
  ngOnInit() {
    // this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const storedUser = localStorage.getItem('user');

    if (typeof storedUser === 'string') {
      const user: User = JSON.parse(storedUser);
      this.authService.seCurrentUser(user);
    }
    else{
      this.authService.currentUserSource.next(null);

    }

  }
}
