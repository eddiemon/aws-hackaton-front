import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

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
      return;
    }

    const that = this;
    authedUser.getSession((err, session) => {
      if (err) {
        return;
      }

      this.userToken = session.getIdToken().getJwtToken();
    });
  }

  getGames() {
    const headers = new HttpHeaders();
    headers.append('Authorization', this.userToken);
    this.http.get('https://tmr0l960fe.execute-api.eu-central-1.amazonaws.com/default/hello-world', { headers: headers })
      .subscribe(
        (response: string) => {
          // this.data = response;
          console.log(response);
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
