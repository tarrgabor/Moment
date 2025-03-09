import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ToplistComponent } from '../toplist/toplist.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { PostContainerComponent } from '../post-container/post-container.component';

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent, SidebarFilterComponent, ToplistComponent, LightboxComponent, PostContainerComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})

export class MainPageComponent implements OnInit{
  ngOnInit(): void {
    document.body.style.overflow = "auto";
  }
}
