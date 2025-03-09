import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LightboxService {
  lightboxImage = new BehaviorSubject<string>("");
  lightboxImage$ = this.lightboxImage.asObservable();

  selectImage(image: string)
  {
    this.lightboxImage.next(image);
  }

  deselectImage()
  {
    this.lightboxImage.next("");
  }
}
