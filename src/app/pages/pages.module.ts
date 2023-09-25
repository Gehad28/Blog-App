import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserModule,
    PostModule
  ],
  exports: [
    PostModule
  ]
})
export class PagesModule { }
