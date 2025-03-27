import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { PostContainerComponent } from '../post-container/post-container.component';
import { AuthService } from '../../services/auth.service';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-profile',
imports: [NavbarComponent, LightboxComponent, PostContainerComponent, FollowButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private auth: AuthService, private api: ApiService){}
  

  username: string = "";
  
  profilePicture: string = "";


  ngOnInit(): void {
    document.body.style.overflow = "auto";
    this.username = this.auth.getLoggedInUser().username;
    this.profilePicture = this.auth.getLoggedInUser().profilePicture;
    
  }
}
