import { Component } from '@angular/core';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [GeneralButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})

export class PageNotFoundComponent {
  constructor(private router: Router){}

  returnBack()
  {
    this.router.navigate(["/"]);
  }
}
