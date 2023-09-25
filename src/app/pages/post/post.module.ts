import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// Components
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';


// Material
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { UserModule } from '../user/user.module';
import { UserRoutingModule } from '../user/user-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  declarations: [
    PostComponent,
    AddPostComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    // UserModule,
    UserRoutingModule,
    ReactiveFormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  exports: [
    PostComponent
  ]
})
export class PostModule { }
