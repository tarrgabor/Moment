import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { IntersectionObserverComponent } from '../intersection-observer/intersection-observer.component';
import { LoadingComponent } from '../loading/loading.component';
import { ApiService } from '../../services/api.service';
import { Comment } from '../../interfaces/interfaces';

@Component({
  selector: 'app-comment-container',
  imports: [CommonModule, CommentComponent, IntersectionObserverComponent, LoadingComponent],
  templateUrl: './comment-container.component.html',
  styleUrl: './comment-container.component.scss'
})

export class CommentContainerComponent {
  constructor(private api: ApiService){}

  @Input("getPostID") postID: string = "";

  comments: Comment[] = [];

  fetching: boolean = false;

  getComments()
  {
    this.fetching = true;

    this.api.getCommentsUnderPost("comments", this.postID).subscribe((res: any) => {
      this.comments = res as Comment[];
      
      this.fetching = false;
    });
  }
}
