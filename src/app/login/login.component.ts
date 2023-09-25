import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

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
    private _router: Router,
    private _userService: UserService
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
    // this._userService.saveUserId('1');  //////////////////////
    const sub = this._userService.login(this.loginform.value).subscribe({
      next: (response: any) => {
        if (response['id'] || response['id'] != undefined) {
          this._userService.saveUserId(response['id']);
          this._userService.subject.next(true);  
          this.message = '';
          this._router.navigate(['home']);
        }
        else if(response['msg']){
          this.message = response['msg'];
        }

      }
    });
  }
}
