import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(
    private api: ApiService,
    private router: Router
  ){}

  user = {
    username: "",
    email: "",
    password: "",
    confirm: ""
  };

  registration(){
    this.api.registration('users', this.user).subscribe((res:any) => {
      if (res.success)
      {
        this.user = {
          username: "",
          email: "",
          password: "",
          confirm: "",
        }

        this.router.navigate(["/login"]);
        return;
      }
    });
  }
}
