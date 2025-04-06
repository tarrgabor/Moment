import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SearchbarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  constructor(private auth: AuthService){}

  username: string = "";
  
  profilePicture: string = "";

  ngOnInit() {
    this.username = this.auth.getLoggedInUser().username;
    this.profilePicture = this.auth.getLoggedInUser().profilePicture;
  }

  openSidebarMenu()
  {
    document.querySelector(".linksContainer")!.classList.add("open");
    document.querySelector("body")!.style.overflowY = "hidden";
  }

  closeSidebarMenu(){
    document.querySelector(".linksContainer")!.classList.remove("open");
    document.querySelector("body")!.style.overflowY = "auto";
  }

  logout()
  {
    this.auth.deleteTokenAndLogout();
  }
}
