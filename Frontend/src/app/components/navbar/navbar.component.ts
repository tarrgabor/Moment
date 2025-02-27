import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavItem } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

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

  cancelConfirm() {
    this.confirmationType = null;
  }

  toggleTheme() {
    document.body.classList.toggle('dark-theme');
  }

}
