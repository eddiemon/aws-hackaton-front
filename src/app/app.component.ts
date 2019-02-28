import { Component, OnInit } from '@angular/core';
// import { AuthorizationService } from './authorization.service';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'AWS Hackaton';

  isLoggedIn: boolean;

  constructor(
    private auth: SessionService,
    private router: Router) {
      if (!environment.production) {
        auth.signIn('eddie');
      } else {
        this.isLoggedIn = auth.isLoggedIn();
      }
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
