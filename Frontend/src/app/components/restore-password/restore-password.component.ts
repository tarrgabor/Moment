import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-restore-password',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.scss'
})

export class RestorePasswordComponent {
  constructor(
    private api: ApiService,
    private router: Router,
    private message: MessageService
  ){}

  @ViewChild('newPassword') newPassword!: GeneralInputComponent;
  @ViewChild('newPasswordConfirm') newPasswordConfirm!: GeneralInputComponent;

  restorePassword()
  {
    let passwords = {
      password: this.newPassword.getValue(),
      confirm: this.newPasswordConfirm.getValue()
    };

    if (!passwords.password || !passwords.confirm)
    {
      this.message.error("Hiányzó adatok!");
      return;
    }
    
    if (passwords.password != passwords.confirm)
    {
      this.message.error("A jelszavak nem egyeznek!");
      return;
    }

    this.api.resetPassword(window.location.search, passwords).subscribe((res: any) => {
      if (res.success)
      {
        this.message.success(res.message);
        this.router.navigate(["/"]);
        return;
      }

      this.message.error(res.message);
    });
  }
}

