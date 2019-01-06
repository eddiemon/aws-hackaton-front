import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userExistMessage: boolean;
  repeatedPasswordMismatch: boolean;

  constructor(private auth: AuthorizationService,
    private router: Router) {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.auth.register(email, password).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, (err) => {
      this.userExistMessage = true;
    });
  }
}
