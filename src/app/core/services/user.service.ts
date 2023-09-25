import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


const baseUrl = 'api/user/';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  subject = new BehaviorSubject(false);
  
  constructor(private _http: HttpClient) { 
    if(localStorage.getItem('id')){
        this.subject.next(true);
    }
  }


  signOut(){
      localStorage.clear();
  }

  saveUserId(id: string){
      localStorage.removeItem('id');
      localStorage.setItem('id', id);
  }

  getUserId(): any{
      return localStorage.getItem('id');
  }

  registerUser(userData: any): Observable<any> {
      return this._http.post(`${baseUrl}add-user`, userData);
  }

  login(userData: any): Observable<any> {
      return this._http.post(`${baseUrl}login`, userData);
  }

  getUser(id: string | null): Observable<any>{
      return this._http.get(`${baseUrl}get-user/` + id);
  }

  updateUser(id: string, userData: any){
      return this._http.put(`${baseUrl}update-user/` + id, userData);
  }

  uploadImage(id: string, image: any) {
      return this._http.post(`${baseUrl}upload-image/${id}`, {image: image});
  }


  addFriend(userId: string, friendId: string): Observable<any>{
      return this._http.post(`${baseUrl}add-friend`, {}, {params: {
          userId: userId,
          friendId: friendId
      }});         
  }

  deleteFriend(userId: string, friendId: string): Observable<any>{
      return this._http.delete(`${baseUrl}delete-friend`, {params: {
          userId: userId,
          friendId: friendId
      }});     
  }

  checkFriend(userId: string, friendId: string): Observable<any>{
      return this._http.put(`${baseUrl}check-friend`, {}, {params: {
          userId: userId,
          friendId: friendId
      }});     
  }

  getFriends(id: string): Observable<any> {
      return this._http.get(`${baseUrl}get-friends/` + id);
  }
}
