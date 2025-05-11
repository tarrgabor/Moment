import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import environment from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router){}

  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  private hasToken()
  {
    return !!localStorage.getItem(environment.tokenName);
  }

  saveTokenAndLogin(token:string)
  {
    localStorage.setItem(environment.tokenName, token);
    this.isLoggedIn.next(true);
    this.router.navigate(["/"]);
  }

  saveNewToken(token: string)
  {
    localStorage.setItem(environment.tokenName, token);
  }

  deleteTokenAndLogout()
  {
    localStorage.removeItem(environment.tokenName);
    this.isLoggedIn.next(false);
    this.router.navigate(["/login"]);
  }

  getLoggedInUser()
  {
    const token = localStorage.getItem(environment.tokenName);

    if (token)
    {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const decodedUTF8Payload = window.atob(base64);

      if (Date.now() > JSON.parse(decodedUTF8Payload).exp * 1000)
      {
        this.deleteTokenAndLogout(); //logs user out after token is expired, but still stays connected after user no longer exists in database (because of localstorage, instead should get user data from database every time the page is refreshed)
      }

      return JSON.parse(decodedUTF8Payload);
    }

    return null;
  }

  getUserRole()
  {
    return this.getLoggedInUser().role;
  }
}
