import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient){}
  serverURL = "http://localhost:3000";

  noCache = new HttpHeaders({
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  getToken()
  {
    return localStorage.getItem(environment.tokenName);
  }

  tokenHeader()
  {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.getToken()}`,
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    return {headers};
  }

  registration(table: string, user: object)
  {
    return this.http.post(`${this.serverURL}/${table}/registration`, user);
  }

  login(table: string, user: object)
  {
    return this.http.post(`${this.serverURL}/${table}/login`, user);
  }

  getPosts(table: string, query?: string)
  {
    return this.http.get(`${this.serverURL}/${table}?${query ? query : ''}`, this.tokenHeader());
  }

  getPost(table: string, postID: string)
  {
    return this.http.get(`${this.serverURL}/${table}/${postID}`, this.tokenHeader());
  }

  getCommentsUnderPost(table: string, postID: string)
  {
    return this.http.get(`${this.serverURL}/${table}/post/${postID}`, this.tokenHeader());
  }

  createComment(table: string, postID: string, message: string)
  {
    return this.http.post(`${this.serverURL}/${table}/create/${postID}`, {message}, this.tokenHeader());
  }

  updateComment(table: string, commentID: string, message: string)
  {
    return this.http.patch(`${this.serverURL}/${table}/update/${commentID}`, {message}, this.tokenHeader());
  }

  deleteComment(table: string, commentID: string)
  {
    return this.http.delete(`${this.serverURL}/${table}/delete/${commentID}`, this.tokenHeader());
  }

  replyToComment(table: string, postID: string, commentID: string, message: string)
  {
    return this.http.post(`${this.serverURL}/${table}/reply/${postID}/${commentID}`, {message}, this.tokenHeader());
  }

  toggleLike(table: string, id: string)
  {
    return this.http.post(`${this.serverURL}/${table}/like/${id}`, null, this.tokenHeader());
  }
}
