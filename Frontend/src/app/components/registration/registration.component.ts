import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private api: ApiService){}

  user = {
    username: "",
    email: "",
    password: "",
    confirm: ""
  };

  registration(){
    this.api.registration('users', this.user).subscribe((res:any) => {
      const invalidFields = res.invalid;

      if (invalidFields.length == 0)
      {
        this.user = {
          username: '',
          email: '',
          password: '',
          confirm: '',
        }
      }
    });
  }
}
