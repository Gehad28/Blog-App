import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'api/';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private _http: HttpClient) { }

  addPost(id: string, post: any): Observable<any> {
    return this._http.post(`${baseUrl}add-post/${id}`, post);
  }

  getAllPosts(id: string): Observable<any> {
    return this._http.get(`${baseUrl}all-posts/${id}`);
  }

  getProfilePosts(userId: string, id: string): Observable<any>{
    return this._http.get(`${baseUrl}/posts/${id}/${userId}`);
  }
}
