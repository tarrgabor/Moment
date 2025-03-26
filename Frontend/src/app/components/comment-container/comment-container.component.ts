import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { LoadingComponent } from '../loading/loading.component';
import { ApiService } from '../../services/api.service';
import { Comment } from '../../interfaces/interfaces';
import { MessageInputComponent } from '../message-input/message-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-comment-container',
  imports: [CommonModule, CommentComponent, LoadingComponent, MessageInputComponent, GeneralButtonComponent],
  templateUrl: './comment-container.component.html',
  styleUrl: './comment-container.component.scss'
})

export class CommentContainerComponent implements OnInit{
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService
  ){}

  @Input("getPostID") postID: string = "";

  comments: Comment[] = [];

  isCommenting: Boolean = false;

  fetching: boolean = false;

  ngOnInit()
  {
    this.getComments();
  }

  getComments()
  {
    this.fetching = true;

    this.api.getCommentsUnderPost("comments", this.postID).subscribe((res: any) => {
      this.comments = res as Comment[];
      
      this.fetching = false;
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

  createComment(message: string)
  {
    this.api.createComment("comments", this.postID, message).subscribe((res: any) => {
      if (res.success)
      {
        res.comment.profilePicture = this.auth.getLoggedInUser().profilePicture;
        res.comment.username = this.auth.getLoggedInUser().username;

        this.comments ? this.comments = [res.comment, ...this.comments] : this.comments = [res.comment];

        this.closeCommenting();

        this.message.success(res.message);
        return;
      }

      this.message.success(res.message);
    });
  }

  appendReply(event: {reply: Comment; parentID: string})
  {
    const comment = this.comments.find(comment => comment.id == event.parentID);

    comment?.replies ? comment.replies = [event.reply, ...comment.replies] : comment!.replies = [event.reply];

    this.message.success("Válasz hozzáadva!");
    /*if (comment)
    {
      if (comment.replies)
      {
        comment.replies = [event.reply, ...comment.replies];
      }
      else
      {
        comment.replies = [event.reply];
      }
    }*/
  }

  removeComment(event: {id: string, parentID: string})
  {
    if (this.comments.find(comment => comment.id == event.parentID)?.replies)
    {
      this.comments.find(comment => comment.id == event.parentID)!.replies = this.comments.find(comment => comment.id == event.parentID)!.replies.filter(reply => reply.id != event.id);
    }

    this.comments = this.comments.filter(comment => comment.id != event.id);

    this.message.success("Komment törölve!");
  }
}
