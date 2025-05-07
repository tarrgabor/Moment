import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-input',
  imports: [FormsModule],
  templateUrl: './general-input.component.html',
  styleUrl: './general-input.component.scss'
})

export class GeneralInputComponent{
  @Input("getType") inputType: string = "";
  @Input("getMaxLength") maxLength: number = -1;
  @Input("getPlaceholder") inputPlaceholder: string = "";

  inputValue: string = "";

  getValue()
  {
    return this.inputValue;
  }
}
