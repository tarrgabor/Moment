import { Component, OnInit } from '@angular/core';
import { LightboxService } from '../../services/lightbox.service';

@Component({
  selector: 'app-lightbox',
  imports: [],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})

export class LightboxComponent implements OnInit{
  constructor(private lightboxService: LightboxService){}

  lightboxImage = "";

  ngOnInit()
  {
    this.lightboxService.lightboxImage$.subscribe(image => {
      this.lightboxImage = image;
    });
  }

  openLightbox()
  {
    document.body.style.overflow = "hidden";
    document.querySelector(".lightbox-container")?.classList.add("open");
  }

  closeLightbox(e: Event)
  {
    this.lightboxService.deselectImage();
    e.stopPropagation();
    document.body.style.overflow = "auto";
    document.querySelector("#lightbox-image")?.classList.remove("zoomed");
    document.querySelector(".lightbox-container")?.classList.remove("open");
  }

  toggleZoom()
  {
    document.querySelector("#lightbox-image")?.classList.toggle("zoomed");
  }
}
