import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ToplistComponent } from '../toplist/toplist.component';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/interfaces';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, NavbarComponent, SidebarFilterComponent, PostComponent, ToplistComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  posts: Post[] =[
    {
      id: "1",
      author: "Jani",
      title: "Poszt 1",
      img: "momentLogo.png",
      likes: "32"
    },
    {
      id: "2",
      author: "Én",
      title: "Poszt 2",
      img: "momentLogo.png",
      likes: "457"
    },
    {
      id: "3",
      author: "Te",
      title: "Poszt 3",
      img: "momentLogo.png",
      likes: "23236"
    },
    {
      id: "4",
      author: "Pista",
      title: "Poszt 4",
      img: "momentLogo.png",
      likes: "634"
    },
    {
      id: "5",
      author: "Béla",
      title: "Poszt 5",
      img: "momentLogo.png",
      likes: "112"
    },
  ]
}
