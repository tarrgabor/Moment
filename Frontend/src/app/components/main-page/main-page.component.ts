import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { ApiService } from '../../services/api.service';
import { PostComponent } from '../post/post.component';
import { Post, User } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { IntersectionObserverComponent } from '../intersection-observer/intersection-observer.component';
import { LoadingComponent } from '../loading/loading.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent, SidebarFilterComponent, LightboxComponent, PostComponent, CommonModule, IntersectionObserverComponent, LoadingComponent, UserComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})

export class MainPageComponent implements OnInit{
  constructor(private api: ApiService){}

  posts: Post[] = [];
  users: User[] = [];

  isFetching: boolean = false;
  hasMoreData: boolean = true;

  cursor: string = "";

  ngOnInit()
  {
    document.body.style.overflow = "auto";
  }

  selectTab(type: string)
  {
    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("type") == type) return;

    searchParams.set("type", type);

    window.location.search = searchParams.toString();
  }

  fetchData()
  {
    const searchParams = new URLSearchParams(window.location.search);

    this.cursor ? searchParams.set("cursor", this.cursor) : null;

    if (this.hasMoreData)
    {
      this.isFetching = true;

      this.api.getContent(searchParams.toString()).subscribe((res: any) => {
        if (searchParams.get("type") == "posts" || searchParams.get("type") == null)
        {
          this.posts.push(...res.posts as Post[]);

          this.cursor = String(res.nextCursor).replace(' ', '+');
  
          if (res.posts.length == 0)
          {
            this.hasMoreData = false;
          }
        }

        if (searchParams.get("type") == "follows")
        {
          this.posts.push(...res.posts as Post[]);

          this.cursor = String(res.nextCursor).replace(' ', '+');
  
          if (res.posts.length == 0)
          {
            this.hasMoreData = false;
          }
        }

        if (searchParams.get("type") == "users")
        {
          this.users.push(...res.users as User[]);
          
          this.cursor = String(res.nextCursor);
  
          if (res.users.length == 0)
          {
            this.hasMoreData = false;
          }
        }

        this.isFetching = false;
      });
    }
  }
}
