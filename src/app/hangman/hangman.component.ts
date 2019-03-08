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
  errorText: string = null;

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
    this.updatePresentation(session);
  }

  // Called from HTML when user makes a guess on a letter
  public async makeAGuess(form: NgForm) {

    if (this.lastSession != null &&
      (this.lastSession.State === 0 || this.lastSession.State === -1)) {
      // If the game never started, or game was lost/won, get a new session
      const session = await this.getGameSession();
      this.updatePresentation(session);
      return;
    }

    if (form.invalid) {
      // Can only make a guess if form validates
      return;
    }

    const inputChars: string = form.value.inputChars.toLowerCase();
    form.resetForm();
    this.errorText = null;

    if (inputChars.length === 0) {
      this.errorText = 'Du kan inte gissa på ingenting..';
    } else if (inputChars.length === 1) {
      this.guessChar(inputChars);
    } else {
      this.errorText = 'Inte implementerad';
    }
  }

  // Sends a request to the 'guessLetterApi' and process the response
  private async guessChar(char: string) {
    const response = await this.http.post(this.guessLetterApi, { letter: char }, { params: this.params }).toPromise();

    if (response === undefined ||
      response['statusCode'] !== 200 ||
      response['body'] === undefined) {
      console.log('Malformed response');
      return;
    }

    const jsonResp = JSON.parse(response['body']);
    const session = this.sessionFromResponse(jsonResp.session);
    this.updatePresentation(session);
  }

  // Sends a request to the 'getGameStateApi' and returns the current session
  private async getGameSession(): Promise<HangmanSession> {
    const response = await this.http.get(this.getGameStateApi, { params: this.params }).toPromise();

    if (response === undefined ||
      response['statusCode'] !== 200 ||
      response['body'] === undefined) {
      console.log('Malformed response');
      return null;
    }

    const jsonResp = JSON.parse(response['body']);
    return this.sessionFromResponse(jsonResp.session);
  }

  // Converts a json object to a HangmanSession object
  // Expects json of format
  // {
  //   state: 2,
  //   guessedLetters: "zebla",
  //   remainingGuesses: 6,
  //   maskedWord: "zeb_a"
  // }
  // State 0 is won game
  // State -1 is lost game
  // State 1-7 is according to the different figures
  private sessionFromResponse(json: any): HangmanSession {
    return new HangmanSession(
      json.state,
      json.guessedLetters,
      json.remainingGuesses,
      json.maskedWord);
  }

  // Updates front-end from session data
  private updatePresentation(session: HangmanSession) {
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
      case -1: return 'Du förlorade tyvärr spelet';
      case 0: return 'Du vann spelet! Trycka på Gissa en gång för att starta ett nytt';
      case 1: return this.figure1;
      case 2: return this.figure2;
      case 3: return this.figure3;
      case 4: return this.figure4;
      case 5: return this.figure5;
      case 6: return this.figure6;
      case 7: return this.figure7;
      default: return 'Något gick fel..';
    }
  }
}
