import { HttpClient } from '@angular/common/http';
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
  
  getPostsByUserId(): Observable<Post[]> {
    const userId = this.authService.getLoggedInUserId();
    console.log(userId);
    if (userId) {
      return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`).pipe(
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
    return this.http.get<Post>(`${this.apiUrl}/${postId}`).pipe(
      map(post => {
        post.imagePath = post.imagePath.replace(/\\/g, '/');
        console.log('SLIKAAA:' + post.imagePath); 
        return post;
      })
    );
  }
  
  getLikesCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${postId}/likes/count`);
  }
  
  updatePost(postId: number, post: Post, userId: number): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, post, {
      params: { userId: userId.toString() }
    });
  }

  deletePost(postId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}?userId=${userId}`);
  }
  
  likeUnlikePost(postId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/like`, null, {
      params: { userId: userId.toString() }
    });
  }
  

}
