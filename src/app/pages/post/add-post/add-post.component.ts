import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {
  addPostForm!:FormGroup;
  imagePath!: File;
  image!: string | ArrayBuffer | null;
  userId!: string;
  subs: Subscription[] = [];
  addPhoto = 'Add Photo';
  post!: Post;
  flag = false;
  submit = 'Create';

  constructor(private _fb: FormBuilder, 
              private dialogRef: MatDialogRef<AddPostComponent>,
              @Inject(MAT_DIALOG_DATA) data: {post: Post, flag: boolean},
              private _postService: PostService,
              private _userService: UserService) {
    this.addPostForm = _fb.group({
      content: null,
      privacy: null
    });

    if(data && data.flag){
      this.addPostForm.patchValue({
        content: data.post.content,
        privacy: data.post.privacy
      });
      this.addPhoto = 'Edit Photo';
      this.flag = data.flag;
      this.post = data.post;
      this.submit = 'Save';
    }
  }

  onUploadImage(event: any) {
    const reader = new FileReader();

    const file = event.target.files;
    this.imagePath = file;
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      this.image = reader.result;
    }
    console.log(reader.result);
  }

  changePrivacy(e: any){
    this.addPostForm.controls['privacy'].setValue(e.target.value, {onlySelf: true});
  }

  onCancle(){
    this.dialogRef.close();
  }

  onSubmit(){
    if (this.addPostForm.invalid) {
      this.addPostForm.markAllAsTouched();
      return;
    }
    const data = {...this.addPostForm.value, image: this.image};

    if(!this.flag){
      const sub = this._postService.addPost(this.userId, data).subscribe({
        next: (response) => console.log(response)
      });
      this.subs.push(sub);
    }
    else{
      data.user = this.post.user;
      data.createAt = this.post.createAt;
      const sub = this._postService.editPost(this.post.id, this.userId, data).subscribe({
        next: res => {
          console.log(res);
          this._postService.postSubject.next(true);
        }
      });
      this.subs.push(sub);
    }
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.userId = this._userService.getUserId();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
