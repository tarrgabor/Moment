import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-textarea',
  imports: [FormsModule],
  templateUrl: './general-textarea.component.html',
  styleUrl: './general-textarea.component.scss'
})

export class GeneralTextareaComponent implements OnInit{
  @Input("getTitle") title: string = "Textarea title";
  @Input("getMaxLength") maxLength: number = 0;
  @Input("getInitialText") initialText: string = "";

  @ViewChild("textarea") textarea!: ElementRef;

  charsUsed: number = 0;

  ngOnInit()
  {
    setTimeout(() => {
      this.setValue();
      this.updateCharLeftInfo();
    }, 0);
  }

  getValue()
  {
    return this.textarea.nativeElement.textContent.substring(0, this.maxLength);
  }

  setValue()
  {
    this.textarea.nativeElement.textContent = this.initialText;
  }

  updateCharLeftInfo()
  {
    (this.textarea.nativeElement.textContent.length > this.maxLength) ? this.textarea.nativeElement.classList.add("error") : this.textarea.nativeElement.classList.remove("error")

    this.charsUsed = this.textarea.nativeElement.textContent.length;
  }
}
