import { Component, Input } from '@angular/core';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { LightboxService } from '../../services/lightbox.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lightbox-listener',
  imports: [CommonModule],
  templateUrl: './lightbox-listener.component.html',
  styleUrl: './lightbox-listener.component.scss'
})
export class LightboxListenerComponent{
  constructor(private lightboxService: LightboxService){}

  @Input("getImage") image = "";

  openLightbox(e: Event)
  {
    e.preventDefault();
    this.lightboxService.selectImage(this.image);
    LightboxComponent.prototype.openLightbox();
  }
}
