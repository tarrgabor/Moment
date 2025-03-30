import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-textarea',
  imports: [FormsModule],
  templateUrl: './general-textarea.component.html',
  styleUrl: './general-textarea.component.scss'
})

export class GeneralTextareaComponent {
  @Input("getTitle") title: string = "Textarea title";
  @Input("getMaxLength") maxLength: number = 0;

  @ViewChild("textarea") textarea!: ElementRef;

  charsUsed: number = 0;

  getValue()
  {
    return this.textarea.nativeElement.textContent.substring(0, this.maxLength);
  }

  updateCharLeftInfo()
  {
    (this.textarea.nativeElement.textContent.length > this.maxLength) ? this.textarea.nativeElement.classList.add("error") : this.textarea.nativeElement.classList.remove("error")

    this.charsUsed = this.textarea.nativeElement.textContent.length;
  }
}
