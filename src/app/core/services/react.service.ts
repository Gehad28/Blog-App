import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { React } from '../models/react';

const baseUrl = 'api';

@Injectable({
  providedIn: 'root'
})
export class ReactService {

  constructor(private _http: HttpClient) { }

  addReact(id: any, react: React): Observable<any>{
    return this._http.post(`${baseUrl}/add-react/${id}`, react);
  }

  getReacts(id: any): Observable<any> {
    return this._http.get(`${baseUrl}/all-react/${id}`);
  }

  deleteReact(postId: any, userId: any): Observable<any> {
    return this._http.delete(`${baseUrl}/delete-react/${postId}/${userId}`);
  }
}
