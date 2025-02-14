import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../interfaces/interfaces';

@Component({
  selector: 'app-post',
  imports: [RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  @Input("getPostData") postData: Post = {
    id: "",
    author: "",
    title: "",
    img: "",
    likes: ""
  };

  ngOnInit(): any {
    this.postData.likes = this.postData.likes.length > 3 ? String(Math.round((Number(this.postData.likes) / 1000))) + "k" : this.postData.likes;
  }
}
