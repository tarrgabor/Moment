import { Component, Input } from '@angular/core';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { MessageInputComponent } from '../message-input/message-input.component';
import { AuthService } from '../../services/auth.service';
import { ContentMenuComponent } from '../content-menu/content-menu.component';
import { DialogService } from '../../services/dialog.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment',
  imports: [LikeButtonComponent, UserContentHeaderComponent, CommonModule, FormsModule, MessageInputComponent, ContentMenuComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})

export class CommentComponent {
  constructor(
    public auth: AuthService,
    private dialog: DialogService,
    private comment: CommentService
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

  isEditing: Boolean = false;

  isReplying: Boolean = false;

  showReplies: Boolean = false;

  updateComment(e: Event)
  {
    this.comment.updateComment(this.commentData.id, e.toString(), (success: boolean) => {
      if (success)
      {
        this.closeUpdate();
      }
    });
  }

  replyToComment(e: Event)
  {
    this.comment.replyToComment(this.commentData.postID, this.commentData.id, e.toString(), (success: boolean) => {
      if (success)
      {
        this.closeReply();
        this.showReplies = true;
      }
    });
  }
  
  deleteComment()
  {
    this.dialog.showDialog("Biztosan törölni szeretné?", "Törlés", () => {
      this.comment.deleteComment(this.commentData.id);
    })
  }


  openUpdate()
  {
    this.isEditing = true;
  }
 
  closeUpdate()
  {
    this.isEditing = false;
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
}