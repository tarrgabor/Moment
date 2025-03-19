import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow-button',
  imports: [CommonModule],
  templateUrl: './follow-button.component.html',
  styleUrl: './follow-button.component.scss'
})

export class FollowButtonComponent implements OnInit{
  isFollowing = false;

  followingStatus = "";

  ngOnInit()
  {
    if (this.isFollowing)
    {
      return this.followingStatus = "Követem";
    }

    return this.followingStatus = "Követés"
  }

  toggleFollow(e: Event, table: string)
  {
    e.preventDefault();
  }
}
