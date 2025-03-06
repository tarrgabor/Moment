import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavItem } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{
  constructor(private auth: AuthService, private renderer: Renderer2, private http: HttpClient){}
  isSettingsOpen = false;
  activeTab: string = 'profile';
  confirmationType: 'delete' | 'deactivate' | null = null;

  openSidebarMenu()
  {
    document.querySelector(".linksContainer")!.classList.add("open");
    document.querySelector("body")!.style.overflowY = "hidden";
  }

  closeSidebarMenu(){
    document.querySelector(".linksContainer")!.classList.remove("open");
    document.querySelector("body")!.style.overflowY = "auto";
  }

  togglePopup() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  closePopup() {
    this.isSettingsOpen = false;
    this.confirmationType = null;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  confirmAction(type: 'delete' | 'deactivate') {
    this.confirmationType = type;
  }

  confirm() {
    if (this.confirmationType === 'delete') {
      console.log('Fiók törölve');
    } else if (this.confirmationType === 'deactivate') {
      console.log('Fiók deaktiválva');
    }
    this.closePopup();
  }

  deleteUser(userId: string) {
    if (!userId) {
      console.error('Hiba: nincs userId megadva');
      return;
    }
    
    this.http.delete(`http://localhost:3000/users/${userId}`).subscribe(
      (res: any) => {
        console.log('User deleted successfully', res);
        this.logout();
      },
      (error) => {
        console.error('Error deleting user', error);
      }
    );
  }
  

  cancelConfirm() {
    this.confirmationType = null;
  }


  logout()
  {
    this.auth.deleteTokenAndLogout();
  }

  isDarkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}

