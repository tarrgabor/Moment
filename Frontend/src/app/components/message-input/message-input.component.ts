import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  imports: [CommonModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})

export class MessageInputComponent implements AfterViewInit {
  @ViewChild("textArea") textArea!: ElementRef;
  @ViewChild("saveButton") saveButton!: ElementRef;

  @Input("getButtonText") buttonText: string = "";
  @Input("getInitialText") initialText: string = "";
  @Input("showProfile") showProfile: boolean = true;

  @Output("sendOutputText") outputText: string = "";

  @Output("onSave") onSave = new EventEmitter();
  @Output("onCancel") onCancel = new EventEmitter();

  constructor(private auth: AuthService){
    this.profilePicture = this.auth.getLoggedInUser().profilePicture;
  }

  profilePicture: string = "";

  resizeTextArea(e: any)
  {
    e.target.style.height = "32px";
    e.target.style.height = `${e.target.scrollHeight}px`;

    if (e.target.value.trim().length == 0)
    {
      this.saveButton.nativeElement.disabled = true;
      return;
    }

    this.saveButton.nativeElement.disabled = false;
  }

  ngAfterViewInit()
  {
    this.textArea.nativeElement.style.height = `${this.textArea.nativeElement.scrollHeight}px`
    this.textArea.nativeElement.focus();

    this.saveButton.nativeElement.disabled = true;
  }
 
  sendClose()
  {
    this.onCancel.emit();
  }

  sendValue()
  {
    this.onSave.emit(this.convertNewlinesToBr(this.textArea.nativeElement.value.trim()));
  }

  convertNewlinesToBr(text: string)
  {
    return text.replace(/\n/g, '<br/>');
  }
  
  convertBrToNewlines(text: string)
  {
    return text.replace(/<br\s*\/?>/g, '\n');
  }
}
