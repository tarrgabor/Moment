import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../interfaces/interfaces';

@Component({
  selector: 'app-user-content-header',
  imports: [],
  templateUrl: './user-content-header.component.html',
  styleUrl: './user-content-header.component.scss'
})

export class UserContentHeaderComponent implements OnInit{
  @Input("getProfilePicture") profilePicture: string = "";
  @Input("getUsername") username: string = "";
  @Input("getCreatedAt") createdAt: any = "";

  createdAgo: any = "";

  ngOnInit()
  {
    this.createdAgo = this.getTimeAgo(this.createdAt);
  }

  getTimeAgo(contentCreatedAt: any)
  {
    const currentTime: any = new Date(new Date().toISOString());
    const postDate: any = new Date(contentCreatedAt.replace(' ', 'T') + 'Z');

    const timeDiff = (currentTime - postDate) / 1000;

    const seconds = Math.floor(timeDiff);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(timeDiff / 3600);
    const days = Math.floor(timeDiff / 86400);

    if (days >= 1) {
      return `${days} napja`;
    }
    else if (hours >= 1) {
      return `${hours} órája`;
    }
    else if (minutes >= 1) {
      return `${minutes} perce`;
    }
    else if (seconds >= 1) {
      return `${seconds} másodperce`;
    }
    else {
      return "Épp most";
    }
  }
}
