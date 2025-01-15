import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:8080/api/analytics'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPostCounts(): Observable<Record<string, number>> {
    const headers = this.authService.getHeaders(); 
    console.log('Headers for getPostCounts:', headers); 
  console.log('Fetching post counts from:', `${this.apiUrl}/posts`); 
    return this.http.get<Record<string, number>>(`${this.apiUrl}/posts`, { headers });
  }
  
  getCommentCounts(): Observable<Record<string, number>> {
    const headers = this.authService.getHeaders(); 
    return this.http.get<Record<string, number>>(`${this.apiUrl}/comments`, { headers });
  }
  
  getUserEngagementStatistics(): Observable<Record<string, number>> {
    const headers = this.authService.getHeaders(); 
    return this.http.get<Record<string, number>>(`${this.apiUrl}/user-engagement`, { headers });
  }
  
}
