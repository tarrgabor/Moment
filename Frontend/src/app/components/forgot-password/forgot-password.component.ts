import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-forgot-password',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'] 
})

export class ForgotPasswordComponent {
  constructor(
    private api: ApiService,
    private message: MessageService
  ){}

  @ViewChild('email') email!: GeneralInputComponent;

  sendEmail()
  {
    const email = this.email.getValue();

    if (!email)
    {
      this.message.error("Hiányzó mező!");
      return;
    }

    this.api.sendEmail(email).subscribe((res: any) => {
      if (res.success)
      {
        this.message.success(res.message);
        return;
      }

      this.message.error(res.message);
    });
  }
}