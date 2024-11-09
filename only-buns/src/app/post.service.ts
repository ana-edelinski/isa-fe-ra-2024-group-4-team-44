import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post.model';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8080/api/posts'; 

  constructor(private http: HttpClient, private authService: AuthService) {} 
  
  createPost(post: Post): Observable<Post> {    
    return this.http.post<Post>(this.apiUrl, post)
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);     
  }   
  
  getPostsByUserId(): Observable<Post[]> {
    const userId = this.authService.getLoggedInUserId();  
    console.log(userId);
    if (userId) {
      return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`);
    } else {
      throw new Error('User not logged in');
    }
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`);
  }
  

}
