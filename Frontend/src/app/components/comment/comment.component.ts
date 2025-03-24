import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { CommonModule } from '@angular/common';
import { Comment } from '../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-comment',
  imports: [LikeButtonComponent, UserContentHeaderComponent, GeneralButtonComponent, CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})

export class CommentComponent {
  constructor(private api: ApiService){}
  
  @Input("getCommentData") commentData: Comment = {
    id: '',
    username: '',
    profilePicture: '',
    postID: '',
    message: '',
    replies: [],
    likes: 0,
    liked: false,
    createdAt: new Date()
  }

  @ViewChild("editCommentTextArea") editCommentTextArea!: ElementRef;
  @ViewChild("editCancelButton") editCancelButton!: ElementRef;

  isEditing: Boolean = false;

  showReplies: Boolean = false;

  resizeTextArea(e: any)
  {
    e.target.style.height = "32px";
    e.target.style.height = `${e.target.scrollHeight}px`;

    if (e.target.value.trim().length == 0)
    {
      this.editCancelButton.nativeElement.disabled = true;
      return;
    }

    this.editCancelButton.nativeElement.disabled = false;
  }

  openEditor()
  {
    this.isEditing = true;

    setTimeout(() => {
      this.editCommentTextArea.nativeElement.style.height = `${this.editCommentTextArea.nativeElement.scrollHeight}px`
    }, .0001);
  }
 
  closeEditor()
  {
    this.isEditing = false;
  }

  modifyComment()
  {
    this.commentData.message = this.convertNewlinesToBr(this.editCommentTextArea.nativeElement.value.trim());

    this.api.updateComment("comments", this.commentData.id, this.commentData.message).subscribe();

    this.closeEditor();
  }

  toggleShowReplies()
  {
    this.showReplies = !this.showReplies;
  }

  convertNewlinesToBr(text: string)
  {
    return text.replace(/\n/g, '<br/>');
  }

  convertBrToNewlines(text: string)
  {
    return text.replace(/<br\s*\/?>/g, '\n');
  }
}