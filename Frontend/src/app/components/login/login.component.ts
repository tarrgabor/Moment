import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private api: ApiService,
    private auth: AuthService
  ){}

  user = {
    email: "",
    password: "",
  };

  login(){
    this.api.login('users', this.user).subscribe((res:any) => {
      if (res.success)
      {
        this.user = {
          email: "",
          password: ""
        }

        this.auth.saveTokenAndLogin(res.token);
        return;
      }
    });
  }
}
