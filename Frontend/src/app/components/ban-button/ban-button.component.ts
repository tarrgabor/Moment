import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ban-button',
  imports: [],
  templateUrl: './ban-button.component.html',
  styleUrl: './ban-button.component.scss'
})

export class BanButtonComponent {
  @Input("isBanned") isBanned: boolean = false;
}
