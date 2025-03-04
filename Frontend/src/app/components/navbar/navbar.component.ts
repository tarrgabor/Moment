import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavItem } from '../../interfaces/interfaces';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  openSidebarMenu()
  {
    document.querySelector(".linksContainer")!.classList.add("open");
    document.querySelector("body")!.style.overflowY = "hidden";
  }

  closeSidebarMenu(){
    document.querySelector(".linksContainer")!.classList.remove("open");
    document.querySelector("body")!.style.overflowY = "auto";
  }
}
