import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {

  private apiUrl = 'http://localhost:4200/api/posts'; 

  constructor(private http: HttpClient) {} 
  
  // createPost(): Observable<Post> {    
  //   return 
  // }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);     
  }       
}
