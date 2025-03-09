import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intersection-observer',
  imports: [],
  templateUrl: './intersection-observer.component.html',
  styleUrl: './intersection-observer.component.scss'
})

export class IntersectionObserverComponent implements OnInit{
  @Output() intersecting = new EventEmitter<boolean>();

  intersectionObs: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting)
      {
        this.intersecting.emit(true);
      }
    })
  })

  ngOnInit() {
    const intersection: any = document.querySelector("#intersectionObserver");

    this.intersectionObs.observe(intersection);
  }
}
