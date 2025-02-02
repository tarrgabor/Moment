import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router){}

    canActivate()
    {
        if (!this.auth.getLoggedInUser())
        {
            this.router.navigate(['/login']);
            return false;
        }

        return true;
    }
}
