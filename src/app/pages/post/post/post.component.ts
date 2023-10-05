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
// import { AddPostComponent } from '../add-post/add-post.component';
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
  defaultImageSrc = '../../../../assets/images/defaultProfile.jpg';
  isReact!: boolean;
  reactType = {
    name: 'Like',
    icon: 'thumb_up',
  };
  subs: Subscription[] = [];
  isCurrentUser = false;
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

  constructor(
    private _userService: UserService,
    private _sanitizer: DomSanitizer,
    private _reactService: ReactService,
    private matDialog: MatDialog,
    private _postService: PostService,
    private _util: Utils
  ) {}

  privacyIcon() {
    if (this.post.privacy == 'PUBLIC') {
      this.post.privacy = 'public';
    } else if (this.post.privacy == 'FRIENDS') {
      this.post.privacy = 'people';
    } else {
      this.post.privacy = 'lock';
    }
  }

  onReact(type: string) {
    const thisUserId = this._userService.getUserId();
    this._userService.getUser(thisUserId).subscribe({
      next: (user) => {
        this.thisUser = user;
        if (user['pic'] != this.defaultImageSrc) {
          this.thisUser.pic = this._util.ConvertImage(user['pic']);
        }
      },
    });
    const react: React = {
      id: '',
      type: type,
      user: this.thisUser,
      userId: thisUserId,
      post: this.post,
      postId: this.post.id,
      isReact: '1'
    };

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
    this.isReact = !this.isReact;

    const sub = this._reactService.addReact(react.user.id, react).subscribe({
      next: (res) => console.log(res),
    });
    this.subs.push(sub);
  }

  showMenu(trigger: MatMenuTrigger) {
    if (!this.isReact) {
      trigger.openMenu();
    } else {
      trigger.closeMenu();
      this.isReact = false;
      this.reactType = {
        name: 'Like',
        icon: 'thumb_up',
      };
    }
  }

  removeReact() {
    this.isReact = false;
  }

  // getReacts(){
  //   const sub = this._reactService.getReacts(this.post.id).subscribe({
  //     next: res => {

  //     }
  //   })
  // }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '90%';
    dialogConfig.data = {
      post: this.post,
      flag: true
    };
    this.matDialog.open(CommentsComponent, dialogConfig);
  }

  sharePost() {
    const sub = this._postService
      .sharePost(this.post.id, this.user.id, this.post)
      .subscribe({
        next: (response) => console.log(response),
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

  deletePost() {
    const sub = this._postService.deletePost(this.post.id).subscribe({
      next: response => console.log(response)
    });
    this.subs.push(sub);
  }

  ngOnInit(): void {
    this.isReact = this.post.isReact;
    this._userService.getUser(this.post.user.id).subscribe({
      next: (user) => {
        this.user = user;
        if (user['pic'] != this.defaultImageSrc) {
          this.user.pic = this._util.ConvertImage(user['pic']);
        }

        if(this.post.user.id == this._userService.getUserId()){
          this.isCurrentUser = true;
        }
        else{
          this.isCurrentUser = false;
        }
      },
    });

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
