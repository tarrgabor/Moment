import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { BoundaryCheckDirective } from '../../directives/boundary-check.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [SearchbarComponent, BoundaryCheckDirective, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  constructor(public auth: AuthService){}

  openSidebarMenu(event: Event)
  {
    event.stopPropagation();
    document.querySelector(".linksContainer")!.classList.add("open");
  }

  closeSidebarMenu(){
    document.querySelector(".linksContainer")!.classList.remove("open");
  }

  logout()
  {
    this.auth.deleteTokenAndLogout();
  }
}