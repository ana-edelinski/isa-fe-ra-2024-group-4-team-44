import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post.model';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8080/api/posts'; 

  constructor(private http: HttpClient) {} 
  
  createPost(post: Post): Observable<Post> {    
    return this.http.post<Post>(this.apiUrl, post)
  }

  uploadImage(file: File): Observable<Post> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    var response = this.http.post<Post>(this.apiUrl+'/uploadImage', formData);
    console.log(response)
    return response;
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);     
  }       
}
