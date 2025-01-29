import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient){}
  serverURL = "http://localhost:3000";

  registration(table: string, user: object)
  {
    return this.http.post(`${this.serverURL}/${table}/registration`, user);
  }

  login(table: string, user: object){
    return this.http.post(`${this.serverURL}/${table}/login`, user);
  }
}
