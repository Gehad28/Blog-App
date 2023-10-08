import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { React } from 'src/app/core/models/react';
import { User } from 'src/app/core/models/user';
import { ReactService } from 'src/app/core/services/react.service';
import { UserService } from 'src/app/core/services/user.service';
import { CommentsComponent } from '../comments/comments.component';
import { PostService } from 'src/app/core/services/post.service';
import { AddPostComponent } from '../add-post/add-post.component';
import { Utils } from 'src/app/core/utils';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post!: Post;
  user: User = {
    id: null,
    name: null,
    email: null,
    password: null,
    pic: null,
    bio: null,
    facebookUsername: null,
    phone: null,
  };
  thisUser: User = {
    id: null,
    name: null,
    email: null,
    password: null,
    pic: null,
    bio: null,
    facebookUsername: null,
    phone: null,
  };
  sharedPostUser: User = {
    id: null,
    name: null,
    email: null,
    password: null,
    pic: null,
    bio: null,
    facebookUsername: null,
    phone: null,
  };
  thisUserId = '';
  defaultImageSrc = '../../../../assets/images/defaultProfile.jpg';
  isReact!: boolean;
  reactType = {
    name: 'Like',
    icon: 'thumb_up',
  };
  subs: Subscription[] = [];
  isCurrentUser = false;
  privacy = '';
  sharedPrivacy = '';
  reactions: React[] = [];
  // type!: number;


  constructor(
    private _userService: UserService,
    private _reactService: ReactService,
    private matDialog: MatDialog,
    private _postService: PostService,
    private _util: Utils
  ) {}

  privacyIcon() {
    if (this.post.privacy == 'PUBLIC') {
      this.privacy = 'public';
    } else if (this.post.privacy == 'FRIENDS') {
      this.privacy = 'people';
    } else {
      this.privacy = 'lock';
    }

    if(this.post.sharedPost){
      if (this.post.sharedPost.privacy == 'PUBLIC') {
        this.sharedPrivacy = 'public';
      } else if (this.post.sharedPost.privacy == 'FRIENDS') {
        this.sharedPrivacy = 'people';
      } else {
        this.sharedPrivacy = 'lock';
      }
    }
  }

  reactIcon(type: any){
    if (type == 'Like') {
      this.reactType = {
        name: 'Like',
        icon: 'thumb_up',
      };
    } else if (type == 'Love') {
      this.reactType = {
        name: 'Love',
        icon: 'favorite',
      };
    }
  }

  showMenu(trigger: MatMenuTrigger) {
    if (this.isReact == false) {
      trigger.openMenu();
    } else {
      trigger.closeMenu();
      this.isReact = false;
      this.reactType = {
        name: 'Like',
        icon: 'thumb_up',
      };
      this.removeReact();
    }
  }

  addReact(type: string){
    const react: React = {
      id: '',
      type: type,
      user: this.thisUser,
      userId: this.thisUserId,
      post: this.post,
      postId: this.post.id
    };
    

    const sub = this._reactService.addReact(this.thisUserId, react).subscribe({
      next: (res) => this._postService.postSubject.next(true)
    });
    this.subs.push(sub);
  }

  removeReact() {
    this.isReact = false;
    const sub = this._reactService.deleteReact(this.post.id, this.thisUserId).subscribe({
      next: res => this._postService.postSubject.next(true)
    });
    this.subs.push(sub);
  }

  onReact(type: string) {
    this.reactIcon(type);

    if(this.post.isReact == null){
      this.addReact(type);
    }
    this.isReact = !this.isReact;
  }

  // getReacts(){
  //   const sub = this._reactService.getReacts(this.post.id).subscribe({
  //     next: res => {
  //       this.reactions = res.data;
  //       if(this.isReact != null){
  //         this.reactions.forEach(react => {
  //           if(this.thisUserId == react.userId){        
  //             this.reactIcon(react.type);
  //           }
  //         });
  //       }
  //     }
  //   });
  // }


  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50%';
    dialogConfig.height = '90%';
    dialogConfig.data = {
      post: this.post,
      flag: true
    };
    this.matDialog.open(CommentsComponent, dialogConfig);
  }

  sharePost() {
    const data = {
      post_desc: this.post.content,
      privacy: 1
    }
    const sub = this._postService
      .sharePost(this.post.id, this.thisUserId, data)
      .subscribe({
        next: (response) => this._postService.postSubject.next(true)
      });
    this.subs.push(sub);
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = {
      post: this.post,
      flag: true
    };
    this.matDialog.open(AddPostComponent, dialogConfig);
  }

  deletePost() {
    const sub = this._postService.deletePost(this.post.id).subscribe({
      next: response => this._postService.postSubject.next(true)
    });
    this.subs.push(sub);
  }


  getUser(id: string | null, u: User){
    const sub = this._userService.getUser(id).subscribe({
      next: (user) => {
        u = user;
        if (user['pic'] != this.defaultImageSrc) {
          u.pic = this._util.ConvertImage(user['pic']);
        }
      },
    });
    this.subs.push(sub);
  }

  ngOnInit(): void {
    this.user = this.post.user;

    this.thisUserId = this._userService.getUserId();
    this.getUser(this.thisUserId, this.thisUser);

    if(this.post.user.id == this._userService.getUserId()){
      this.isCurrentUser = true;
    }
    else{
      this.isCurrentUser = false;
    }

    // this.type = this.post.isReact;
    if(this.post.isReact == 1){
      this.reactIcon('Like');
      this.isReact = true;
    }
    else if (this.post.isReact == 2){
      this.reactIcon('Love');
      this.isReact = true;
    }
    else{
      this.isReact = false;
    }
    
    this.privacyIcon();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.matDialog.closeAll();
  }
}
