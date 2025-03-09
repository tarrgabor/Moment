import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { ApiService } from '../../services/api.service';
import { Post } from '../../interfaces/interfaces';
import { LoadingComponent } from '../loading/loading.component';
import { IntersectionObserverComponent } from '../intersection-observer/intersection-observer.component';

@Component({
  selector: 'app-post-container',
  imports: [CommonModule, PostComponent, LoadingComponent, IntersectionObserverComponent],
  templateUrl: './post-container.component.html',
  styleUrl: './post-container.component.scss'
})
export class PostContainerComponent{
  constructor(private api: ApiService){}

  oldestPost: string = "";

  anyMorePosts: boolean = true;

  fetching: boolean = false;

  getPosts()
  {
    if (this.anyMorePosts)
    {
      this.fetching = true;

      this.api.getPosts("posts", this.oldestPost).subscribe((res: any) => {
        this.posts.push(...res.posts as Post[]);
        
        this.oldestPost = "oldestPost=" + String(res.oldestPost).replace(' ', '+');

        if (res.posts.length == 0)
        {
          this.anyMorePosts = false;
        }

        this.fetching = false;
      });
    }
  }

  posts: Post[] = [];
}
