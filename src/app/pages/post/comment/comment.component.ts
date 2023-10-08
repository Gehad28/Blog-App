import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { CommentService } from 'src/app/core/services/comment.service';
import { UserService } from 'src/app/core/services/user.service';
import { Comment } from 'src/app/core/models/comment';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() comment!: Comment;
  @Output() obs = new EventEmitter<any>();
  userId!: string;
  editForm!: FormGroup;
  subs: Subscription[] = [];
  editFlag = false;

  constructor(private _commentService: CommentService,
              private _userService: UserService,
              private _fb: FormBuilder) {}


  editComment(){
    this.editFlag = true;
    this.editForm = this._fb.group({
      content: this.comment.content
    });
  }

  onSubmit(){
    const data = {
      ...this.editForm.value, 
      post: this.comment.post, 
      user: this.comment.user, 
      postId: this.comment.post.id, 
      userId: this.comment.user.id
    };
    const sub = this._commentService.editComment(this.comment.commentId, data).subscribe({
      next: res => {
        this.editFlag = false;
        this.comment.content = res.content;
      }
    });
    this.subs.push(sub);
  }

  deleteComment(){
    const sub = this._commentService.deleteComment(this.comment.commentId, this.userId).subscribe({
      next: res => {
        this.obs.emit(res);
      }
    });
    this.subs.push(sub);
  }

  ngOnInit(): void {
    this.userId = this._userService.getUserId();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      if(sub){
        sub.unsubscribe();
      }
    });
  }
}
