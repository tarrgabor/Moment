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

  getUsersPosts(table: string, username: string, query?: string)
  {
    return this.http.get(`${this.serverURL}/${table}/user/${username}?${query ? query : ''}`, this.tokenHeader());
  }

  createPost(table: string, data: object)
  {
    return this.http.post(`${this.serverURL}/${table}/create`, data, this.tokenHeader());
  }

  updatePost(table: string, postID: string, data: object)
  {
    return this.http.patch(`${this.serverURL}/${table}/update/${postID}`, data, this.tokenHeader());
  }

  deletePost(table: string, postID: string)
  {
    return this.http.delete(`${this.serverURL}/${table}/delete/${postID}`, this.tokenHeader());
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

  toggleFollow(table: string, username: string)
  {
    return this.http.post(`${this.serverURL}/${table}/follow/${username}`, null, this.tokenHeader());
  }

  getProfile(username: string)
  {
    return this.http.get(`${this.serverURL}/users/profile/${username}`, this.tokenHeader())
  }
  
  getCategories(table: string)
  {
    return this.http.get(`${this.serverURL}/${table}`, this.tokenHeader());
  }

  createCategory(table: string, name: string)
  {
    return this.http.post(`${this.serverURL}/${table}/create`, {name}, this.tokenHeader());
  }

  deleteCategory(table: string, id: string)
  {
    return this.http.delete(`${this.serverURL}/${table}/delete/${id}`, this.tokenHeader());
  }

  search(parameters: string)
  {
    return this.http.get(`${this.serverURL}/search/searchbar?${parameters}`, this.tokenHeader());
  }

  getContent(parameters: string)
  {
    return this.http.get(`${this.serverURL}/search?${parameters}`, this.tokenHeader());
  }

  sendEmail(email: string)
  {
    return this.http.post(`${this.serverURL}/users/reset/request`, {email}, this.tokenHeader());
  }

  resetPassword(token: string, passwords: object)
  {
    return this.http.patch(`${this.serverURL}/users/reset/password${token}`, passwords, this.tokenHeader());
  }

  toggleBan(username: string)
  {
    return this.http.post(`${this.serverURL}/users/toggleban/${username}`, {}, this.tokenHeader());
  }

  uploadProfilePicture(username: string, data: object)
  {
    return this.http.patch(`${this.serverURL}/users/profile/picture/${username}`, data, this.tokenHeader());
  }

  requestRefreshedToken()
  {
    return this.http.post(`${this.serverURL}/users/refresh`, {}, this.tokenHeader());
  }
}
