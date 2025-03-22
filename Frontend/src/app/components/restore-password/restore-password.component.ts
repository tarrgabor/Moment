import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';

@Component({
  selector: 'app-restore-password',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.scss'
})

export class RestorePasswordComponent {
  constructor(
    private api: ApiService,
    private router: Router
  ){}

  @ViewChild('newPassword') newPassword!: GeneralInputComponent;
  @ViewChild('newPasswordConfirm') newPasswordConfirm!: GeneralInputComponent;

  restorePassword()
  {
    let passwords = {
      newpassword: this.newPassword.getValue(),
      newconfirm: this.newPasswordConfirm.getValue()
    };

    alert("restore password logic comes here");
  }
}

