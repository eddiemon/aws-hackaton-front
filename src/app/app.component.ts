import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'AWS Hackaton';

  isLoggedIn: boolean;

  constructor(
    private auth: AuthorizationService,
    private router: Router) {
      this.isLoggedIn = auth.isLoggedIn();
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('login');
    } else {
      this.isLoggedIn = true;
      this.router.navigateByUrl('games');
    }
  }

  signOut() {
    this.auth.logOut();
    this.isLoggedIn = false;
    this.router.navigateByUrl('login');
  }

}
