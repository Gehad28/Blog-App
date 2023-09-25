import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../core/services/post.service';
import { UserService } from '../core/services/user.service';
import { Subscription } from 'rxjs';
import { Post } from '../core/models/post';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPostComponent } from '../pages/post/add-post/add-post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  id!: string;
  posts: Post[] = [];

  constructor(private _postService: PostService,
              private _userService: UserService,
              private matDialog: MatDialog) {}

  openDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    this.matDialog.open(AddPostComponent, dialogConfig);
    this.matDialog.afterAllClosed.subscribe({
      next: () => {
        const sub = this._postService.getAllPosts(this.id).subscribe({
          next: respons => {
            this.posts = respons['data'].reverse();
          }
        });
        this.subs.push(sub);
      }
    })
  }

  ngOnInit(): void {
    this.id = this._userService.getUserId();
    const sub = this._postService.getAllPosts(this.id).subscribe({
      next: respons => this.posts = respons['data'].reverse()
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
