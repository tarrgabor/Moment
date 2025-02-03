import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'] 
})
export class ForgotPasswordComponent {
  user = { email: '' }; 

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ){}

  
  forgotPw() {
    console.log('Forgot Password logic for:', this.user.email);
    alert("az email elküldve");
    this.router.navigate(["/verification"]); 
  }
    
  
    
}

