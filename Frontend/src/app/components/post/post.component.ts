import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-post',
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  constructor(private api: ApiService){}

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
    createdAt: '',
    liked: false
  };

  ngOnInit() {
    if (this.postData.liked)
    {
      setTimeout(() => {
        document.getElementById(`${this.postData.postID}`)?.classList.add("liked");
      }, 10);
    }
  }

  toggleLike()
  {
    this.api.togglePostLike("posts", this.postData.postID).subscribe((res: any) => {
      if (res.liked)
      {
        this.postData.likes += 1;
        return document.getElementById(`${this.postData.postID}`)?.classList.add("liked");
      }

      this.postData.likes -= 1;
      document.getElementById(`${this.postData.postID}`)?.classList.remove("liked");
    });
  }
}
