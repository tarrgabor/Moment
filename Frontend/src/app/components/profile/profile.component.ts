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
  
  isFollowersList = false;
  isFollowsList = false;

  profile: any = {
    username: "",
    email: "",
    role: "",
    profilePicture: "",
    followerCount: 0,
    followedCount: 0,
    status: ""
  }


  ngOnInit(): void {
    document.body.style.overflow = "auto";
    
    this.fetchProfileData();
  }

  togglePopupFollowers() {
    this.isFollowersList = !this.isFollowersList;
  }

  togglePopupFollows() {
    this.isFollowsList = !this.isFollowsList;
  }

  closePopup() {
    this.isFollowersList = false;
    this.isFollowsList = false;
  }

  fetchProfileData()
  {
    this.api.getProfile(window.location.pathname.split('/')[2]).subscribe((res: any) => {
      this.profile = res.user;
    });
  }
}

