import { Component, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { LightboxListenerComponent } from '../lightbox-listener/lightbox-listener.component';
import { CommonModule } from '@angular/common';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-post',
  imports: [RouterLink, LightboxListenerComponent, CommonModule, LikeButtonComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  @Input("getPostData") postData: Post = {
    userID: '',
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

  ngOnInit()
  {
    this.createdAgo = this.getTimeAgo(this.postData.createdAt);

    this.processedTitle = this.postData.title.replaceAll(' ', '_');

    if (this.postData.liked)
    {
      setTimeout(() => {
        document.getElementById(`${this.postData.postID}`)?.classList.add("liked");
      }, 10);
    }
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
