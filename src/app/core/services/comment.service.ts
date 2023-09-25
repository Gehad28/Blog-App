import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

const baseUrl = 'api/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _http: HttpClient) { }

  addComment(id: string, comment: Comment): Observable<any>{
    return this._http.post(`${baseUrl}/add-comment/${id}`, comment);
  }

  getAllComments(id: string): Observable<any> {
    return this._http.get(`${baseUrl}/all-comment/${id}`);
  }
}
