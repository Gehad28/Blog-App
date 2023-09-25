import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/app/core/models/post';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit{
  @Input() post!: Post;
  user: User = {
    id: null,
    name: null,
    email: null,
    password: null,
    pic: null,
    bio: null,
    facebookUsername: null,
    phone: null
  };
  defaultImageSrc = '../../../../assets/images/defaultProfile.jpg';

  constructor(private _userService: UserService, private _sanitizer: DomSanitizer){
  }

  privacyIcon(){
    if(this.post.privacy == 'PUBLIC'){
      this.post.privacy = 'public';
    }
    else if(this.post.privacy == 'FRIENDS'){
      this.post.privacy = 'people';
    }
    else{
      this.post.privacy = 'lock';
    }
  }

  ngOnInit(): void {
    this._userService.getUser(this.post.user.id).subscribe({
      next: (user) => {
        this.user = user;
        if(user['pic'] != this.defaultImageSrc){
          this.user.pic = this._sanitizer.bypassSecurityTrustResourceUrl(user['pic']) as string;
        }
      } 
    });

    this.privacyIcon();
  }

}
