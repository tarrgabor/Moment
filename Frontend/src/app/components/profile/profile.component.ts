import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { ApiService } from '../../services/api.service';
import { Post } from '../../interfaces/interfaces';
import { PostComponent } from '../post/post.component';
import { IntersectionObserverComponent } from '../intersection-observer/intersection-observer.component';
import { LoadingComponent } from '../loading/loading.component';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, SidebarFilterComponent, LightboxComponent, PostComponent, IntersectionObserverComponent, LoadingComponent, FollowButtonComponent, PageNotFoundComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit{
  constructor(
    private api: ApiService,
    private auth: AuthService
  ){}

  profile: any = {
    username: "",
    email: "",
    role: "",
    profilePicture: "",
    followerCount: 0,
    followedCount: 0,
    status: ""
  }

  posts: Post[] = [];

  isFetching: boolean = false;
  hasMoreData: boolean = true;
  userFound = true;

  cursor: string = "";

  username: string = "";

  self: boolean = false;

  ngOnInit()
  {
    this.username = window.location.pathname.split('/')[2];
    this.getUserData();

    if (this.auth.getLoggedInUser().username == this.username)
    {
      this.self = true;
    }
  }

  getUserData()
  {
    this.api.getProfile(this.username).subscribe((res: any) => {
      this.profile = res.user;

      if (!res.success)
      {
        this.userFound = false;
      }
    });
  }

  fetchData()
  {
    const searchParams = new URLSearchParams();

    this.cursor ? searchParams.set("cursor", this.cursor) : null;

    if (this.hasMoreData)
    {
      this.isFetching = true;

      this.api.getUsersPosts("posts", this.username, searchParams.toString()).subscribe((res: any) => {
        this.posts.push(...res.posts as Post[]);

        this.cursor = String(res.nextCursor).replace(' ', '+');

        if (res.posts.length == 0)
        {
          this.hasMoreData = false;
        }
      })

      this.isFetching = false;
    }
  }

  toggleFollow()
  {
    this.api.toggleFollow("users", this.username).subscribe((res: any) => {
      if (res.success)
      {
        this.profile.followed = res.followed;

        if (res.followed)
        {
          this.profile.followerCount++;
          return;
        }

        this.profile.followerCount--;
      }
    });
  }
}