import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ToplistComponent } from '../toplist/toplist.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { PostContainerComponent } from '../post-container/post-container.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile',
imports: [NavbarComponent, SidebarFilterComponent, ToplistComponent, LightboxComponent, PostContainerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private auth: AuthService){}

  username: string = "";
  
  profilePicture: string = "";

  ngOnInit(): void {
    document.body.style.overflow = "auto";
    this.username = this.auth.getLoggedInUser().username;
    this.profilePicture = this.auth.getLoggedInUser().profilePicture;
  }
}
