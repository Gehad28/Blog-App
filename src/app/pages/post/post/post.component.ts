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
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy{
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
  isReact = false;
  reactType = {
    name: 'Like',
    icon: 'thumb_up'
  };
  subs: Subscription[] = [];

  constructor(private _userService: UserService, private _sanitizer: DomSanitizer,
              private _reactService: ReactService,
              private matDialog: MatDialog){
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

  onReact(type: string){
    const react: React = {
      id: '',
      type: type,
      user: this.user,
      userId: this.user.id,
      post: this.post,
      postId: this.post.id
    }

    if(type == '1'){
      this.reactType = {
        name: 'Like',
        icon: 'thumb_up'
      }
    }
    else if(type == '2'){
      this.reactType = {
        name: 'Love',
        icon: 'favorite'
      }
    }
    this.isReact = !this.isReact;

    const sub = this._reactService.addReact(react.user.id, react).subscribe({
      next: res =>  console.log(res)
    });
    this.subs.push(sub);
  }

  showMenu(trigger: MatMenuTrigger){
    if(!this.isReact){
      trigger.openMenu();
    }
    else{
      trigger.closeMenu();
      this.isReact = false;
      this.reactType = {
        name: 'Like',
        icon: 'thumb_up'
      }
    }
  }

  removeReact(){
    this.isReact = false;
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '90%';
    dialogConfig.data = this.post;
    this.matDialog.open(CommentComponent, dialogConfig);
    // this.matDialog.afterAllClosed.subscribe({
    //   next: () => {
    //     const sub = this._postService.getAllPosts(this.id).subscribe({
    //       next: respons => {
    //         this.posts = respons['data'].reverse();
    //       }
    //     });
    //     this.subs.push(sub);
    //   }
    // })
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

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      if(sub){
        sub.unsubscribe();
      }
    });
    this.matDialog.closeAll();
  }

}
