import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HangmanComponent } from './hangman/hangman.component';
import { RegisterComponent } from './register/register.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';
import { GameLauncherComponent } from './game-launcher/game-launcher.component';

const routes: Routes = [
  {path: 'hangman', component: HangmanComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'games', component: GameLauncherComponent},
  {path: 'tictactoe', component: TictactoeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
