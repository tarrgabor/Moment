import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LightboxListenerComponent } from '../lightbox-listener/lightbox-listener.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { CommentContainerComponent } from '../comment-container/comment-container.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';

@Component({
  selector: 'app-open-post',
  imports: [NavbarComponent, CommonModule, LightboxListenerComponent, LightboxComponent, LikeButtonComponent, PageNotFoundComponent, CommentContainerComponent, UserContentHeaderComponent],
  templateUrl: './open-post.component.html',
  styleUrl: './open-post.component.scss'
})

export class OpenPostComponent implements OnInit{
  constructor(private api: ApiService){}

  postData: Post = {
    username: '',
    profilePicture: '',
    postID: '',
    title: '',
    description: '',
    category: '',
    image: '',
    likes: 0,
    createdAt: new Date(),
    liked: false
  };

  isLiked = false;

  fetchedData = false;

  postFound = true;

  ngOnInit()
  {
    const postID = window.location.pathname.match("(?<=\/post\/)([^\/]+)")?.[1];

    this.api.getPost("posts", postID!).subscribe(res => {
      if (res)
      {
        this.postData = res as Post;

        this.fetchedData = true;
  
        if (decodeURIComponent(window.location.pathname.match("\([^\/]+)$")![0]) != this.postData.title.replaceAll(' ', '_').match("^\([^\/]+)$")?.[1])
        {
          window.location.pathname = `post/${postID}/${this.postData.title.replaceAll(' ', '_')}`;
        }

        return
      };

      this.postFound = false;
    });
  }
}
