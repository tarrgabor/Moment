import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comment',
  imports: [LikeButtonComponent, UserContentHeaderComponent, CommonModule, FormsModule, MessageInputComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})

export class CommentComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
  ){}
  
  @Input("getCommentData") commentData: Comment = {
    id: '',
    username: '',
    profilePicture: '',
    postID: '',
    message: '',
    replies: [],
    likes: 0,
    liked: false,
    owned: false,
    createdAt: new Date()
  }

  @Input("getParentID") parentID: string = "";

  @Output() onReply = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  isEditing: Boolean = false;

  isReplying: Boolean = false;

  showReplies: Boolean = false;

  ngOnInit()
  {
    if (!this.parentID)
    {
      this.parentID = this.commentData.id;
    }
  }

  openUpdate()
  {
    this.isEditing = true;
  }
 
  closeUpdate()
  {
    this.isEditing = false;
  }

  updateComment(e: Event)
  {
    this.commentData.message = e.toString();

    this.api.updateComment("comments", this.parentID, e.toString()).subscribe();

    this.closeUpdate();
  }

  toggleShowReplies()
  {
    this.showReplies = !this.showReplies;
  }

  openReply()
  {
    this.isReplying = true;
  }

  closeReply()
  {
    this.isReplying = false;
  }

  replyToComment(e: Event)
  {
    this.api.replyToComment("comments", this.commentData.postID, this.parentID, e.toString()).subscribe((res: any) => {
      if (res.success)
      {
        this.onReply.emit({
          reply: {
            id: res.comment.id,
            postID: res.comment.postID,
            message: res.comment.message,
            createdAt: res.comment.createdAt,
            likes: res.comment.likes,
            owned: res.comment.owned,
            profilePicture: this.auth.getLoggedInUser().profilePicture,
            username: this.auth.getLoggedInUser().username
          },
          parentID: this.parentID});

        this.showReplies = true;

        this.closeReply();
      }
    });
  }

  deleteComment()
  {
    this.api.deleteComment("comments", this.commentData.id).subscribe((res: any) => {
      if (res.success)
      {
        this.onDelete.emit({id: this.commentData.id, parentID: this.parentID});
      }
    })
  }
}