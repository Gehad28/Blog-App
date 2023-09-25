import { Component } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userId = '';
  isUser = false;
  
  constructor(private _userService: UserService, private router: Router){}

  ngOnInit(): void {
    this.userId = this._userService.getUserId();
    this._userService.subject.subscribe({
      next: v => {
        if(v){
          this.userId = this._userService.getUserId();
          this.isUser = true;
        }
        else{
          this.isUser = false;
        }
      }
    })
  }

  login(){
    this.router.navigate(['login']);
  }

  register(){
    this.router.navigate(['register']);
  }

  signOut(){
    this._userService.signOut();
    this._userService.subject.next(false);
    this.router.navigate(['']);
  }
}
