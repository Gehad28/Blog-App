import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private subs: Subscription[] = [];
  registerForm!: FormGroup;
  message!: null;
  defaultImageSrc = '../../../../assets/images/defaultProfile.jpg';

  constructor(
    private _login: FormBuilder,
    private _router: Router,
    private _userService: UserService
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
    const data = {...this.registerForm.value, pic: this.defaultImageSrc};
    const sub = this._userService.registerUser(data).subscribe({
      next: (response: any) => {
        this._userService
          .login({ email: response.email, password: response.password })
          .subscribe({
            next: (response: any) => {
              this._userService.saveUserId(response.id);
              this._userService.subject.next(true);
              this._router.navigate(['home']);
              this.message = null;
              if (response['msg']) {
                this.message = response['msg'];
              }
            },

          });
      },
      error: (error: any) => console.log(error),
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((el) => el.unsubscribe());
  }
}
