import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import environment from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(){}

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
  }

  deleteTokenAndLogout()
  {
    localStorage.removeItem(environment.tokenName);
    this.isLoggedIn.next(false);
  }

  getLoggedInUser()
  {
    const token = localStorage.getItem(environment.tokenName);

    if (token)
    {
      const decodedUTF8Payload = new TextDecoder('utf-8').decode(
        new Uint8Array(atob(token.split('.')[1]).split('').map(char => char.charCodeAt(0)))
      );

      if (Date.now() > JSON.parse(decodedUTF8Payload).exp * 1000)
      {
        this.deleteTokenAndLogout(); //logs user out after token is expired, but still stays connected after user no longer exists in database (because of localstorage, instead should get user data from database every time the page is refreshed)
      }

      return JSON.parse(decodedUTF8Payload);
    }

    return null;
  }
}
