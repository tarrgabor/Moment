import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-general-button',
  imports: [],
  templateUrl: './general-button.component.html',
  styleUrl: './general-button.component.scss'
})

export class GeneralButtonComponent {
  @Input("getText") buttonText: string = "";
}
