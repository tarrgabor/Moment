import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { LoadingComponent } from '../loading/loading.component';
import { Comment } from '../../interfaces/interfaces';
import { MessageInputComponent } from '../message-input/message-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment-container',
  imports: [CommonModule, CommentComponent, LoadingComponent, MessageInputComponent, GeneralButtonComponent],
  templateUrl: './comment-container.component.html',
  styleUrl: './comment-container.component.scss'
})

export class CommentContainerComponent implements OnInit, OnDestroy{
  constructor(
    private comment: CommentService
  ){}

  @Input("getPostID") postID: string = "";

  comments: Comment[] = [];

  isCommenting: Boolean = false;

  fetching: boolean = false;

  ngOnInit()
  {
    this.getComments();

    this.comment.commentsSubject.subscribe((res: any) => {
      this.comments = res as Comment[];
    });
  }

  ngOnDestroy()
  {
    this.comment.commentsSubject.unsubscribe();
  }

  getComments()
  {
    this.comment.getComments(this.postID);
  }

  createComment(message: string)
  {
    this.comment.createComment(this.postID, message, (success: boolean) => {
      if (success)
      {
        this.closeCommenting();
        return;
      }
    });
  }

  openCommenting()
  {
    this.isCommenting = true;
  }

  closeCommenting()
  {
    this.isCommenting = false;
  }
}
