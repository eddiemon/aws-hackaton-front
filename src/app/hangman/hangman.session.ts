export class HangmanSession {
    State: number;
    GuessedLetters: string;
    RemainingGuesses: number;
    Word: string;

    constructor(state, guessedLetters, remainingGuesses, maskedWord) {
        this.State = Number(state);
        this.GuessedLetters = guessedLetters;
        this.RemainingGuesses = Number(remainingGuesses);
        this.Word = maskedWord;
    }
}
