import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private api: ApiService){}

  user = {

    email: "",
    password: "",

  };

  login(){
    this.api.login('users', this.user).subscribe((res:any) => {
      const invalidFields = res.invalid;

      if (invalidFields.length == 0)
      {
        this.user = {

          email: '',
          password: '',

        }
      }
    });
  }
}
