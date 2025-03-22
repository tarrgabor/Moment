import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LightboxListenerComponent } from '../lightbox-listener/lightbox-listener.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';

@Component({
  selector: 'app-open-post',
  imports: [NavbarComponent, CommonModule, LightboxListenerComponent, LightboxComponent, LikeButtonComponent, CommentComponent, GeneralButtonComponent],
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

  createdAgo: any = null;

  isLiked = false;

  processedTitle: string = "";

  fetchedData = false;

  ngOnInit()
  {
    const postID = window.location.pathname.match("^\/post\/([a-z0-9\-]{36})")?.[1];

    this.api.getPost("posts", postID!).subscribe(res => {
      this.postData = res as Post;

      this.fetchedData = true;

      this.createdAgo = this.getTimeAgo(this.postData.createdAt);

      if (this.postData.liked)
      {
        setTimeout(() => {
          document.getElementById(`${this.postData.postID}`)?.classList.add("liked");
        }, 10);
      }

      if (decodeURIComponent(window.location.pathname.match("\([^\/]+)$")![0]) != this.postData.title.replaceAll(' ', '_').match("^\([^\/]+)$")?.[1])
      {
        window.location.pathname = `post/${postID}/${this.postData.title.replaceAll(' ', '_')}`;
      }
    });
  }

  getTimeAgo(postTime: any)
  {
    const currentTime: any = new Date(new Date().toISOString());
    const postDate: any = new Date(postTime.replace(' ', 'T') + 'Z');

    const timeDiff = (currentTime - postDate) / 1000;

    const seconds = Math.floor(timeDiff);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(timeDiff / 3600);
    const days = Math.floor(timeDiff / 86400);

    if (days >= 1) {
      return `${days} napja`;
    }
    else if (hours >= 1) {
      return `${hours} órája`;
    }
    else if (minutes >= 1) {
      return `${minutes} perce`;
    }
    else if (seconds >= 1) {
      return `${seconds} másodperce`;
    }
    else {
      return "Épp most";
    }
  }
}
