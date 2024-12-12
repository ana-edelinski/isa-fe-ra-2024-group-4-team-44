import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Post } from './model/post.model';
import { AuthService } from './auth/auth.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8080/api/posts'; 

  constructor(private http: HttpClient, private authService: AuthService) {} 
  
  createPost(post: Post): Observable<Post> {    
    const userId = this.authService.getLoggedInUserId();
    console.log(userId);

    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Post>(this.apiUrl, post, { headers })
  }

  uploadImage(file: File): Observable<Post> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('file', file, file.name);

    var response = this.http.post<Post>(this.apiUrl+'/uploadImage', formData, { headers });
    console.log(response)
    return response;
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((posts: any[]) => {
        posts.forEach((post: { imagePath: string; }) => {
          if (post.imagePath) {
          post.imagePath = post.imagePath.replace('src\\main\\resources\\static', '');
          post.imagePath = post.imagePath.replace(/\\/g, '/');
          }
        });
        return posts;
      })
    );
          
  }   
  
  getPostsByUserId(): Observable<Post[]> {
    const userId = this.authService.getLoggedInUserId();
    console.log(userId);

    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    if (userId) {
      return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
        map(posts => {
          posts.forEach(post => {
            if (post.imagePath) {
            post.imagePath = post.imagePath.replace('src\\main\\resources\\static', '');
            post.imagePath = post.imagePath.replace(/\\/g, '/');
            }
          });
          return posts;
        })
      );
    } else {
      throw new Error('User not logged in');
    }
  }
  

  getPostById(postId: number): Observable<Post> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const serverUrl = 'http://localhost:8080'; 
  
    return this.http.get<Post>(`${this.apiUrl}/${postId}`, { headers }).pipe(
      map(post => {
        post.imagePath = serverUrl + post.imagePath.replace(/\\/g, '/'); 
        console.log('SLIKAAA:' + post.imagePath); 
        return post;
      })
    );
  }
  
  
  getLikesCount(postId: number): Observable<number> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<number>(`${this.apiUrl}/${postId}/likes/count`, { headers });
  }
  
  updatePost(postId: number, post: Post, userId: number): Observable<Post> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Post>(`${this.apiUrl}/${postId}`, post, {
      headers: headers,
      params: { userId: userId.toString() }
    });
}


  deletePost(postId: number, userId: number): Observable<void> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${postId}?userId=${userId}`, { headers });
  }
  
  likeUnlikePost(postId: number, userId: number): Observable<void> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<void>(`${this.apiUrl}/${postId}/like`, null, {
      headers: headers,
      params: { userId: userId.toString() }
    });
  }

  getPostsBySpecificUser(userId: number): Observable<Post[]> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('Authorization token is missing');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      map(posts => {
        posts.forEach(post => {
          if (post.imagePath) {
            post.imagePath = post.imagePath.replace('src\\main\\resources\\static', '');
            post.imagePath = post.imagePath.replace(/\\/g, '/');
          }
        });
        return posts;
      })
    );
  }
  
}
