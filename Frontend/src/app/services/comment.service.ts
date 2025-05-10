import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
import { Comment } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService
  ){}

  comments: Comment[] = [];

  commentsSubject = new BehaviorSubject<Comment[]>([]);

  getComments(postID: string)
  {
    this.api.getCommentsUnderPost("comments", postID).subscribe((res: any) => {
      this.comments.push(...res as Comment[]);
      this.commentsSubject.next(this.comments);
    });
  }

  createComment(postID: string, message: string, cb: Function)
  {
    if (!postID || !message)
    {
      this.message.error("Komment hozzáadása sikertelen!");
      return;
    }

    this.api.createComment("comments", postID, message).subscribe((res: any) => {
      if (res.success)
      {
        res.comment.profilePicture = this.auth.getLoggedInUser().profilePicture;
        res.comment.username = this.auth.getLoggedInUser().username;

        this.comments ? this.comments = [res.comment, ...this.comments] : this.comments = [res.comment];
        this.commentsSubject.next(this.comments);

        this.message.success("Komment hozzáadva!");
        cb(res.success);
        return;
      }

      this.message.error("Komment hozzáadása sikertelen!");
      cb(res.success);
    });
  }

  updateComment(commentID: string, message: string, cb: Function)
  {
    if (!commentID || !message)
    {
      this.message.error("Komment módosítása sikertelen!");
      return;
    }

    const parentID = this.findParentID(commentID) || commentID;

    this.api.updateComment("comments", commentID, message).subscribe((res: any) => {
      if (res.success)
      {
        if (commentID == parentID)
        {
          this.comments.find(comment => comment.id == commentID)!.message = message;
        }
        else
        {
          this.comments.find(comment => comment.id == parentID)!.replies.find(reply => reply.id == commentID)!.message = message;
        }

        this.commentsSubject.next(this.comments);

        this.message.success("Komment módosítva!");
        cb(res.success);
        return;
      }

      this.message.error("Komment módosítása sikertelen!");
      cb(res.success);
    });
  }

  deleteComment(commentID: string)
  {
    if (!commentID)
    {
      this.message.error("Komment törlése sikertelen!");
      return;
    }

    this.api.deleteComment("comments", commentID).subscribe((res: any) => {
      if (res.success)
      {
        this.comments = this.comments.filter(comment => comment.id != commentID);

        this.comments.forEach(comment => {
          comment.replies = comment.replies?.filter(reply => reply.id != commentID);
        });

        this.commentsSubject.next(this.comments);

        this.message.success("Komment törölve!");
        return
      }

      this.message.error("Komment törlése sikertelen!");
    });
  }

  replyToComment(postID: string, commentID: string, message: string, cb: Function)
  {
    if (!postID || !commentID || !message)
    {
      this.message.error("Válasz hozzáadása sikertelen!");
      return;
    }

    const parentID: string = this.findParentID(commentID) || commentID;

    this.api.replyToComment("comments", postID, parentID, message).subscribe((res: any) => {
      if (res.success)
      {
        res.comment.profilePicture = this.auth.getLoggedInUser().profilePicture;
        res.comment.username = this.auth.getLoggedInUser().username;

        const comment = this.comments.find(comment => comment.id == parentID);
        comment?.replies ? comment.replies = [res.comment, ...comment.replies] : comment!.replies = [res.comment];
        this.commentsSubject.next(this.comments);

        this.message.success("Válasz hozzáadva!");
        cb(res.success);
        return;
      }

      this.message.error("Válasz hozzáadása sikertelen!");
      cb(res.success);
    })
  }

  findParentID(replyID: string)
  {
    for (const comment of this.comments)
    {
      for (const reply of comment.replies || [])
      {
        if (reply.id == replyID)
        {
          return comment.id;
        }
      }
    }

    return null;
  }
}
