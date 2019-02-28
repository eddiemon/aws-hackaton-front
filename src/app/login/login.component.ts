import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: SessionService,
              private router: Router) {
  }

  onSubmit(form: NgForm) {
    const username = form.value.username;

    this.auth.signIn(username);
    this.router.navigateByUrl('/games');
  }
}
