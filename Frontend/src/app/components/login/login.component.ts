import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { GeneralInputComponent } from '../general-input/general-input.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { GeneralLinkComponent } from '../general-link/general-link.component';
import { GeneralInputFormComponent } from '../general-input-form/general-input-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-login',
  imports: [GeneralInputComponent, GeneralButtonComponent, GeneralLinkComponent, GeneralInputFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService
  ){}

  @ViewChild('email') email!: GeneralInputComponent;
  @ViewChild('password') password!: GeneralInputComponent;

  login(){
    let user = {
      email: this.email.getValue(),
      password: this.password.getValue(),
    };

    this.api.login('users', user).subscribe((res: any) => {
      if (res.success)
      {
        this.message.success(res.message);
        this.auth.saveTokenAndLogin(res.token);
        return;
      }

      this.message.error(res.message);
    });
  }
}
