import { Component } from '@angular/core';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-comment',
  imports: [LikeButtonComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})

export class CommentComponent {

}
