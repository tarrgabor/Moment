import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';

@Component({
  selector: 'app-verification-code',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss'
})

export class VerificationCodeComponent {
  constructor(
    private api: ApiService,
    private router: Router
  ){}

  @ViewChild('code') code!: GeneralInputComponent;

  checkCode()
  {
    let code = this.code.getValue();
    
    alert("code checking comes here");
    this.router.navigate(["/restore"]); 
  }
}
