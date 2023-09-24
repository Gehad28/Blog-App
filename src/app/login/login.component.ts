import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginform!: FormGroup;
  message!: string;

  constructor(
    private _login: FormBuilder,
    private _router: Router
  ) {
    this.loginform = this._login.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  getError(control: string, error: string): boolean {
    return this.loginform.controls[control].touched && this.loginform.controls[control].hasError(error);
  }

  submitForm() {
    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();
      return;
    }
    const data = this.loginform.value;
    console.log(data);
  }
}
