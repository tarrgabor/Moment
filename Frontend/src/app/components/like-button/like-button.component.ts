import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-like-button',
  imports: [],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss'
})

export class LikeButtonComponent implements OnInit{
  constructor(private api: ApiService){}

  @Input("getID") id: string = ""; 

  @Input("getLikes") likes: number = 0;

  @Input("getIsLiked") liked: Boolean = false;

  formattedLikes: string = "";

  ngOnInit()
  {
    if (this.liked)
    {
      document.getElementById(this.id)?.classList.add("liked");
    }

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

  toggleLike(e: Event, table: string)
  {
    e.stopPropagation();
    this.api.toggleLike(table, this.id).subscribe((res: any) => {
      if (res.liked)
      {
        this.likes += 1;
        this.formatLike();
        return document.getElementById(this.id)?.classList.add("liked");
      }

      this.likes -= 1;
      this.formatLike()
      document.getElementById(this.id)?.classList.remove("liked");
    });
  }

  stopPropagation(e: Event)
  {
    e.stopPropagation();
  }
}
