import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit {

  // guessCharUrl = 'https://l90psmonkb.execute-api.eu-north-1.amazonaws.com/dev/guess/char';
  readonly initGameUrl = 'https://l90psmonkb.execute-api.eu-north-1.amazonaws.com/dev/init';

  userToken: any;

  figure1 = `  _______
  |/      |
  |
  |
  |
  |
  |
 _|___`;

  figure2 = `  _______
  |/      |
  |      (_)
  |
  |
  |
  |
 _|___`;

  state = this.figure1;

  constructor(
    private http: HttpClient,
    private auth: AuthorizationService,
    private router: Router) {
  }

  ngOnInit() {
    const authedUser = this.auth.getAuthenticatedUser();
    if (authedUser == null) {
      this.router.navigateByUrl('login');
      return;
    }

    const that = this;
    authedUser.getSession((err, session) => {
      if (err) {
        return;
      }

      this.userToken = session.getIdToken().getJwtToken();
    });

    this.initGame();
  }

  guessChar() {
  }

  initGame() {
    const headers = new HttpHeaders()
      .append('Authorization', this.userToken);

    this.http.get(this.initGameUrl, { headers: headers })
      .subscribe(
        (response: any) => {
          const jsonResp = JSON.parse(response.body);
          console.log(jsonResp);
        },
        error => {
          console.log(error);
        }
      );
  }

  signOut() {
    this.auth.logOut();
    this.router.navigateByUrl('login');
  }

}