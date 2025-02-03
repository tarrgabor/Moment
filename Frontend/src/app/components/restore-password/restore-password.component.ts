import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restore-password',
  imports: [RouterLink, FormsModule],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.scss'
})
export class RestorePasswordComponent {


  user = { email: '' }; 

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ){}

  restorePw() {
    console.log('Forgot Password logic for:', this.user.email);
    alert("új jelszó elmentve");
    this.router.navigate(["/"]); 
  }
  
    
  
    
}

