import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit {
  readonly apiEndpoint = environment.API_ENDPOINT;
  readonly getGameStateApi = this.apiEndpoint + '/hangman-api/state';
  readonly playCharApi = this.apiEndpoint + '/hangman-api/playchar';
  readonly playWordApi = this.apiEndpoint + '/hangman-api/playword';

//#region Figures

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

figure3 = `  _______
 |/      |
 |      (_)
 |       |
 |       |
 |
 |
_|___`;

figure4 = `  _______
 |/      |
 |      (_)
 |       |
 |       |
 |      /
 |
_|___`;

figure5 = `  _______
 |/      |
 |      (_)
 |       |
 |       |
 |      / \\
 |
_|___`;

figure6 = `  _______
 |/      |
 |      (_)
 |      /|
 |       |
 |      / \\
 |
_|___`;

figure7 = `  _______
 |/      |
 |      (_)
 |      /|\\
 |       |
 |      / \\
 |
_|___`;

//#endregion

  state = 1;
  printOut: string = this.figure1;

  constructor(
    private http: HttpClient,
    private auth: SessionService,
    private router: Router) {
  }

  ngOnInit() {
    const authedUser = this.auth.getAuthenticatedUser();
    if (authedUser == null) {
      this.router.navigateByUrl('login');
      return;
    }

    this.getGameState();
  }

  // Expect json of format
  // {
  //   state: 1
  // }
  // State 0 is won game
  // State -1 is lost game
  // State 1-7 is according to the different figures
  private getGameState() {
    const httpParams = new HttpParams().set('userId', this.auth.getAuthenticatedUser().getUsername());

    this.http.get(this.getGameStateApi, { params: httpParams })
      .subscribe(
        (response: any) => {
          console.log(response);

          if (response === undefined || response.body === undefined || response.body.state === undefined) {
            console.log('Malformed response');
            return;
          }

          const jsonResp = JSON.parse(response.body);
          console.log(jsonResp);
        },
        error => {
          console.log(error);
        }
      );
  }

  private guessChar() {
    this.state = (this.state + 1) % 8;
    this.printOut = this.stateToPrintOut(this.state);
  }

  private stateToPrintOut(state: number): string {
    switch (state) {
      case -1: return 'Förlorade spelet';
      case 0: return 'Vann spelet!';
      case 1: return this.figure1;
      case 2: return this.figure2;
      case 3: return this.figure3;
      case 4: return this.figure4;
      case 5: return this.figure5;
      case 6: return this.figure6;
      case 7: return this.figure7;
    }
  }
}
