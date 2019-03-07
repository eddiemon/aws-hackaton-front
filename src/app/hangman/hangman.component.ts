import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HangmanSession } from './hangman.session';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit {
  readonly apiEndpoint = environment.API_ENDPOINT;
  readonly getGameStateApi = this.apiEndpoint + '/hangman-api/state';
  readonly guessLetterApi = this.apiEndpoint + '/hangman-api/guessletter';

  readonly params = new HttpParams().append('username', this.auth.getAuthenticatedUser().getUsername());

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

  hangmanFigure: string = this.figure1;
  word: string;
  guessedLetters: string;
  remainingGuesses: string;
  errorText: string;

  lastSession: HangmanSession;

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

    const session = await this.getGameSession();
    this.updateSession(session);
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
    const response = await this.http.get(this.getGameStateApi, { params: this.params }).toPromise();

    if (response === undefined ||
      response['statusCode'] !== 200 ||
      response['body'] === undefined) {
      console.log('Malformed response');
      return null;
    }

    const jsonResp = JSON.parse(response['body']);
    return this.sessionFromResponse(jsonResp);
  }

  public async makeAGuess(form: NgForm) {
    if (this.lastSession != null &&
      (this.lastSession.State === 0 || this.lastSession.State === -1)) {
      const session = await this.getGameSession();
      this.updateSession(session);
      return;
    }

    const inputChars: string = form.value.inputChars.toLowerCase();
    this.errorText = '';

    if (inputChars.length === 0) {
      this.errorText = 'Du kan inte gissa på ingenting..';
    } else if (inputChars.length === 1) {
      this.guessChar(inputChars);
    } else {
      this.errorText = 'Inte implementerad';
    }
  }

  private async guessChar(char: string) {
    const response = await this.http.post(this.guessLetterApi, { letter: char }, { params: this.params }).toPromise();

    if (response === undefined ||
      response['statusCode'] !== 200 ||
      response['body'] === undefined) {
      console.log('Malformed response');
      return;
    }

    const jsonResp = JSON.parse(response['body']);
    const session = this.sessionFromResponse(jsonResp);
    this.updateSession(session);
  }

  private sessionFromResponse(jsonResponse: any): HangmanSession {
    return new HangmanSession(
      jsonResponse.session.state,
      jsonResponse.session.guessedLetters,
      jsonResponse.session.remainingGuesses,
      jsonResponse.session.maskedWord);
  }

  private updateSession(session: HangmanSession) {
    if (session != null) {
      this.word = session.Word;
      this.remainingGuesses = session.RemainingGuesses.toString();
      this.guessedLetters = session.GuessedLetters;
      this.hangmanFigure = this.stateToPrintOut(session.State);

      this.lastSession = session;
    } else {
      this.hangmanFigure = 'Något gick fel';
    }
  }

  private stateToPrintOut(state: number): string {
    switch (state) {
      case -2: return 'Något gick fel..';
      case -1: return 'Förlorade spelet';
      case 0: return 'Du vann spelet! Trycka på Gissa en gång för att starta ett nytt';
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
