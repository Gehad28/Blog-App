import { Component, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { User } from 'src/app/core/models/user';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';
import { AddPostComponent } from '../../post/add-post/add-post.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
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

  id!: any; // id in routerLink
  currentUserId!: string; // user id from local storage

  // User Info
  defaultImageSrc = '../../../../assets/images/defaultProfile.jpg';
  friendsList: User[] = [];
  editProfileForm: FormGroup = this._fb.group({
    name: '',
    bio: '',
    email: '',
    password: '',
    phone: '',
    facebookUsername: '',
  });
  reader = new FileReader();
  imagePath!: File;
  isFriend: boolean = false;
  editForm = false;
  isCuurentUser = false;
  posts: Post[] = [];

  // Subscriptions
  subs: Subscription[] = [];

  // UI
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened: boolean = true;


  isFixed: boolean = false;

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 100) {
      this.isFixed = true;
    } else {
      this.isFixed = false;
    }
  }

  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private _fb: FormBuilder,
    private routerReuse: RouteReuseStrategy,
    private _sanitizer: DomSanitizer,
    private _util: Utils
  ) {
    this.routerReuse.shouldReuseRoute = function () {
      return false;
    };
  }

  // ___ FUNCTIONS ___

  // Get user object from api
  getUser(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
        if (user['pic'] != this.defaultImageSrc) {
          this.user.pic = this._util.ConvertImage(user['pic']);
        }
      },
    });
  }

  // Get friends list of the current profile
  getFriends(id: string) {
    const subFriends = this.userService.getFriends(id).subscribe({
      next: (friends: any) => {
        this.friendsList = friends;
        this.friendsList.forEach((ele: any) => {
          if (ele['pic'] != this.defaultImageSrc) {
            ele['pic'] = this._util.ConvertImage(ele['pic']);
          }
        });
      },
    });
    this.subs.push(subFriends);
  }

  // Check if the user and the current profile are friends or not
  checkFriend(userId: string, id: string) {
    const subCheck = this.userService.checkFriend(userId, id).subscribe({
      next: (response: boolean) => {
        this.isFriend = response;
      },
    });
    this.subs.push(subCheck);
  }

  // Get all user info
  getProfileInfo() {
    const sub = this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // get profile id from the route
      this.getUser(this.id);

      this.currentUserId = this.userService.getUserId(); // get user id from the local storage

      if (this.currentUserId != this.id) {
        this.checkFriend(this.currentUserId, this.id);
        this.isCuurentUser = false;
      } else {
        this.isCuurentUser = true;
      }

      this.getFriends(this.id);
    });

    this.subs.push(sub);
  }

  // For edit profile button
  editProfile() {
    this.editForm = true;
    this.editProfileForm.patchValue({
      name: this.user.name,
      bio: this.user.bio,
      email: this.user.email,
      password: this.user.password,
      phone: this.user.phone,
      facebookUsername: this.user.facebookUsername,
    });
  }

  // Cancle edit profile form
  onCancle() {
    this.editForm = false;
  }

  // Submit edit profile form
  onSubmit() {
    this.editForm = false;
    const updated = this.editProfileForm.value;
    // updated.pic = this.user.pic.changingThisBreaksApplicationSecurity;
    const subButton = this.userService
      .updateUser(this.currentUserId, updated)
      .subscribe({
        next: (resonse: any) => {
          this.user = resonse;
          if (resonse['pic'] != this.defaultImageSrc) {
            this.user.pic = this._util.ConvertImage(resonse['pic']);
          }
        },
      });

    this.subs.push(subButton);
  }

  // For upload photo
  onChange(event: any) {
    const file = event.target.files;
    // this.imagePath = file;
    this.reader.readAsDataURL(file[0]);
    this.reader.onload = (_event) => {
      const subImage = this.userService
        .uploadImage(this.currentUserId, this.reader.result)
        .subscribe({
          next: (response: any) => {
            this.user.pic = this._util.ConvertImage(response['image']);
          },
        });

      this.subs.push(subImage);
    };
  }

  getUserPosts() {
    const sub = this.postService
      .getProfilePosts(this.currentUserId, this.id)
      .subscribe({
        next: (response) => {
          (this.posts = response['data'].reverse());
          console.log(this.posts)
        }
      });
    this.subs.push(sub);
  }

  // For add friend button
  addFriend() {
    const subButton = this.userService
      .addFriend(this.currentUserId, this.id)
      .subscribe({
        next: () => {
          this.isFriend = true;
          this.getFriends(this.id);
        },
      });

    this.subs.push(subButton);
  }

  // For delete friend button
  deleteFriend() {
    const subButton = this.userService
      .deleteFriend(this.currentUserId, this.id)
      .subscribe({
        next: () => {
          this.isFriend = false;
          this.getFriends(this.id);
        },
      });

    this.subs.push(subButton);
  }

  // Add post dialog
  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    this.matDialog.open(AddPostComponent, dialogConfig);
    this.matDialog.afterAllClosed.subscribe({
      next: () => {
        const sub = this.postService
          .getProfilePosts(this.currentUserId, this.id)
          .subscribe({
            next: (respons) => {
              this.posts = respons['data'].reverse();
            },
          });
        this.subs.push(sub);
      },
    });
  }

  // For sidenav
  toggle() {
    this.opened = !this.opened;
    if (this.opened) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
    return this.opened;
  }

  ngOnInit(): void {
    this.getProfileInfo();
    this.getUserPosts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((ele) => {
      if (ele) {
        ele.unsubscribe();
      }
    });
  }

  ngAfterViewInit(): void {}
}
