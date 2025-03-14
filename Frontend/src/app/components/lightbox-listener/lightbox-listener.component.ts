import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { LightboxService } from '../../services/lightbox.service';

@Component({
  selector: 'app-lightbox-listener',
  imports: [],
  templateUrl: './lightbox-listener.component.html',
  styleUrl: './lightbox-listener.component.scss'
})
export class LightboxListenerComponent{
  constructor(private lightboxService: LightboxService){}

  @Input("getImage") image = "";

  openLightbox(e: Event)
  {
    e.stopPropagation();
    this.lightboxService.selectImage(this.image);
    LightboxComponent.prototype.openLightbox();
  }
}
