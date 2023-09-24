import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  message!: null;

  constructor(
    private _login: FormBuilder,
    private _router: Router
  ) {
    this.registerForm = this._login.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    })
  }

  getError(control: string, error: string): boolean {
    return this.registerForm.controls[control].touched && this.registerForm.controls[control].hasError(error);
  }

  submitForm() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const data = this.registerForm.value;
    
    console.log(data);
  }
}
