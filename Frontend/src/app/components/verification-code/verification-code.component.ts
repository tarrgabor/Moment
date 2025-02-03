import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification-code',
  imports: [RouterLink, FormsModule],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss'
})
export class VerificationCodeComponent {
   constructor(
      private api: ApiService,
      private auth: AuthService,
      private router: Router
    ){}
  verification() {
    
    alert("helyes kód");
    this.router.navigate(["/restore"]); 
  }
}
