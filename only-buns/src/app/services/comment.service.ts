import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../model/post.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../profile/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8080/api/comments'; 

  createComment(comment: Comment): Observable<Comment> {
    const userId = this.authService.getLoggedInUserId();
    
    console.log(userId);
    if(userId){      
      comment.userId = userId;
    }
    

    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Comment>(this.apiUrl, comment, { headers })
  }
}
