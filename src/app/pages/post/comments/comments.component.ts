import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { CommentService } from 'src/app/core/services/comment.service';
import { UserService } from 'src/app/core/services/user.service';
import { Comment } from 'src/app/core/models/comment';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  comments: Comment[] = [];
  addCommentForm!:FormGroup;
  subs: Subscription[] = [];
  post!: Post;
  userId!: string;
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

  constructor(private _fb: FormBuilder, 
              private dialogRef: MatDialogRef<CommentsComponent>,
              @Inject(MAT_DIALOG_DATA) data: Post,
              private _commentService: CommentService,
              private _userService: UserService) {
    this.addCommentForm = _fb.group({
      comment: null
    });

    this.post = data;
  }

  getComments(){
    const sub = this._commentService.getAllComments(this.post.id).subscribe({
      next: response => {
        this.comments = response['data'];
      }
    });
    this.subs.push(sub);
  }

  onSubmit(){
    const comment: Comment = {
      commentId: '',
      content: this.addCommentForm.controls['comment'].value,
      user: this.user,
      post: this.post,
      userId: this.userId,
      postId: this.post.id
    }
    const sub = this._commentService.addComment(this.post.id, comment).subscribe({
      next: response => this.getComments()
    });
    this.subs.push(sub);
    this.addCommentForm.reset();
  }

  update(obs: any) {
    if(obs.success){
      this.getComments();
    }
  }

  ngOnInit(): void {
    this.getComments();

    this.userId = this._userService.getUserId();
    const subUser = this._userService.getUser(this.userId).subscribe({
      next: user => this.user = user
    });
    this.subs.push(subUser);

  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      if(sub){
        sub.unsubscribe();
      }
    });
    this.dialogRef.close();
  }
}
