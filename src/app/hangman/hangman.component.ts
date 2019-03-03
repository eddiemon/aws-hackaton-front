import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HangmanSession } from './hangman.session';

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

  session: HangmanSession;
  printOut: string = this.figure1;

  constructor(
    private http: HttpClient,
    private auth: SessionService,
    private router: Router) {
  }

  async ngOnInit() {
    const authedUser = this.auth.getAuthenticatedUser();
    if (authedUser == null) {
      this.router.navigateByUrl('login');
      return;
    }

    await this.updateSession();
  }

  // Expect json of format
  // {
  //   state: 1,
  //   guessedLetters: "string",
  //   remainingGuesses: 7
  // }
  // State 0 is won game
  // State -1 is lost game
  // State 1-7 is according to the different figures
  private async getGameSession(): Promise<HangmanSession> {
    const params = new HttpParams().append('username', this.auth.getAuthenticatedUser().getUsername());

    const response = await this.http.get(this.getGameStateApi, { params }).toPromise();

    if (response === undefined ||
        response['statusCode'] !== 200 ||
        response['body'] === undefined) {
      console.log('Malformed response');
      return null;
    }

    const jsonResp = JSON.parse(response['body']);
    return new HangmanSession(jsonResp.session.state, jsonResp.session.guessedLetters, jsonResp.session.remainingGuesses);
  }

  private async guessChar() {
    await this.updateSession();
  }

  private async updateSession() {
    this.session = await this.getGameSession();
    if (this.session != null) {
      this.printOut = this.stateToPrintOut(this.session.State);
    } else {
      this.printOut = 'Något gick fel';
    }
  }

  private stateToPrintOut(state: number): string {
    switch (state) {
      case -2: return 'Något gick fel..';
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
