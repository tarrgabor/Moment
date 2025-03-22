import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';

@Component({
  selector: 'app-forgot-password',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'] 
})

export class ForgotPasswordComponent {
  constructor(
    private api: ApiService,
    private router: Router
  ){}

  @ViewChild('email') email!: GeneralInputComponent;

  sendEmail()
  {
    let code = this.email.getValue();

    alert("email sending mechanic comes here");
    this.router.navigate(["/verification"]); 
  }
}