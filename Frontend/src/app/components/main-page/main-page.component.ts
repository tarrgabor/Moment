import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ToplistComponent } from '../toplist/toplist.component';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, NavbarComponent, SidebarFilterComponent, PostComponent, ToplistComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit{
  constructor(private api: ApiService){}

  ngOnInit()
  {
    this.getPosts();
  }

  getPosts()
  {
    this.api.getPosts("posts").subscribe((res: any) => {
      this.posts.push(...res.posts as Post[]);
    })
  }

  posts: Post[] = [];
}
