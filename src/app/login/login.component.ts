import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailOrPasswordIncorrect = false;

  constructor(private auth: AuthorizationService,
              private router: Router) {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.auth.signIn(email, password).subscribe((data) => {
      this.router.navigateByUrl('/games');
    }, (err) => {
      this.emailOrPasswordIncorrect = true;
    });
  }

  gotoRegister() {
    this.router.navigateByUrl('/register');
  }
}
