import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-registration',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(
    private api: ApiService,
    private router: Router,
    private message: MessageService
  ){}

  @ViewChild('username') username!: GeneralInputComponent;
  @ViewChild('email') email!: GeneralInputComponent;
  @ViewChild('password') password!: GeneralInputComponent;
  @ViewChild('confirm') confirm!: GeneralInputComponent;

  registration(){
    let user = {
      username: this.username.getValue(),
      email: this.email.getValue(),
      password: this.password.getValue(),
      confirm: this.confirm.getValue()
    };

    this.api.registration('users', user).subscribe((res:any) => {
      if (res.success)
      {
        this.message.success(res.message);
        this.router.navigate(["/login"]);
        return;
      }

      this.message.error(res.message);
    });
  }
}
