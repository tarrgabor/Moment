import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeLogoComponent } from '../theme-logo/theme-logo.component';

@Component({
  selector: 'app-general-input-form',
  imports: [CommonModule, ThemeLogoComponent],
  templateUrl: './general-input-form.component.html',
  styleUrl: './general-input-form.component.scss'
})

export class GeneralInputFormComponent {
  @Input("requireLogo") requireLogo: boolean = true;

  @Input("getInstructions") instructions: string = "";
}
