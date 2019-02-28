import { Injectable } from '@angular/core';
import { GameUser } from './game-user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private currentUser: GameUser = null;

  constructor() { }

  signIn(username: string): void {
    this.currentUser = new GameUser(username);
  }

  getAuthenticatedUser(): GameUser {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  logOut(): void {
    this.currentUser = null;
  }
}
