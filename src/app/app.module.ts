import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SessionService } from './session.service';
import { HangmanComponent } from './hangman/hangman.component';
import { RegisterComponent } from './register/register.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';
import { GameLauncherComponent } from './game-launcher/game-launcher.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HangmanComponent,
    RegisterComponent,
    TictactoeComponent,
    GameLauncherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
