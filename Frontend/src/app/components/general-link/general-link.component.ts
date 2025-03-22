import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-general-link',
  imports: [RouterLink],
  templateUrl: './general-link.component.html',
  styleUrl: './general-link.component.scss'
})

export class GeneralLinkComponent {
  @Input("getPath") linkPath: string = "";

  @Input("getText") linkText: string = "";
}
