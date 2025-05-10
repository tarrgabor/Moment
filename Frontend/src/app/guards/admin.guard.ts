import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}

  canActivate()
  {
    if (this.auth.getLoggedInUser().role == "admin")
    {
      return true;
    }

    return false;
  }
}