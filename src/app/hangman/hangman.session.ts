export class HangmanSession {
    State: number;
    GuessedLetters: string;
    RemainingGuesses: number;

    constructor(state, guessedLetters, remainingGuesses) {
        this.State = state;
        this.GuessedLetters = guessedLetters;
        this.RemainingGuesses = remainingGuesses;
    }
}
