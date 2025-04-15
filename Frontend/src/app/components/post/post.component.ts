import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
import { LightboxListenerComponent } from '../lightbox-listener/lightbox-listener.component';
import { CommonModule } from '@angular/common';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';

@Component({
  selector: 'app-post',
  imports: [LightboxListenerComponent, CommonModule, LikeButtonComponent, UserContentHeaderComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  @Input("getPostData") postData: Post = {
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

  processedTitle: string = "";

  ngOnInit()
  {
    this.processedTitle = this.postData.title.replaceAll(' ', '_');
  }
}
