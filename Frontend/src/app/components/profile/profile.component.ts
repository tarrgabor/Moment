import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { PostContainerComponent } from '../post-container/post-container.component';
import { AuthService } from '../../services/auth.service';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { ApiService } from '../../services/api.service';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
imports: [NavbarComponent, LightboxComponent, PostContainerComponent, FollowButtonComponent, SidebarFilterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private auth: AuthService, private api: ApiService, private http: HttpClient){}
  

  username: string = "";
  
  profilePicture: string = "";

  followersCount: number = 0;
  followedCount: number = 0;


  ngOnInit(): void {
    document.body.style.overflow = "auto";
    this.username = this.auth.getLoggedInUser().username;
    this.profilePicture = this.auth.getLoggedInUser().profilePicture;
    this.fetchFollowersCount();
    this.fetchFollowedCount();
    document.body.style.overflow = "auto";
  }

  fetchFollowersCount(): void {
    this.http.post<{ followers: any[] }>(`/api/followers/${this.username}`, {}).subscribe({
      next: (response) => {
        this.followersCount = response.followers.length;
      },
      error: (error) => {
        console.error('Error fetching followers:', error);
      }
    });
  }

  fetchFollowedCount(): void {
    this.http.post<{ followedUsers: any[] }>(`/api/followed/${this.username}`, {}).subscribe({
      next: (response) => {
        this.followedCount = response.followedUsers.length;
      },
      error: (error) => {
        console.error('Error fetching followed users:', error);
      }
    });
  }
}

