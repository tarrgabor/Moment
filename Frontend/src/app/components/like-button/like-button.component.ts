import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like-button',
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss'
})

export class LikeButtonComponent implements OnInit {
  constructor(private api: ApiService){}

  @Input("getType") type: string = "";

  @Input("getID") id: string = ""; 

  @Input("getLikes") likes: number = 0;

  @Input("getIsLiked") liked: boolean = false;

  formattedLikes: string = "";

  ngOnInit()
  {
    this.formatLike();
  }

  formatLike()
  {
    this.formattedLikes = this.likes.toString();

    if (this.likes >= 1e+3) {
      this.formattedLikes = (this.likes / 1e+3).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (this.likes >= 1e+6) {
      this.formattedLikes = (this.likes / 1e+6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (this.likes >= 1e+9) {
      this.formattedLikes = (this.likes / 1e+9).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (this.likes >= 1e+12) {
      this.formattedLikes = (this.likes / 1e+12).toFixed(1).replace(/\.0$/, '') + 'T';
    }
  }

  toggleLike(type: string)
  {
    this.api.toggleLike(type, this.id).subscribe((res: any) => {
      if (res.liked)
      {
        this.likes += 1;
        this.formatLike();
        this.liked = true;
        return;
      }

      this.likes -= 1;
      this.formatLike()
      this.liked = false;
    });
  }

  preventDefault(e: Event)
  {
    e.preventDefault();
  }
}
