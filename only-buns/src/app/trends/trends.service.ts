import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrendsService {

  private baseUrl = 'http://localhost:8080/api/trends';

  constructor(private http: HttpClient) { }

   // Ukupan broj objava
   getTotalPosts(): Observable<number> {
     const token = localStorage.getItem('token');  
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.baseUrl}/total-posts`, {headers});
  }

  // Broj objava u poslednjih 30 dana
  getPostsLast30Days(): Observable<number> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.baseUrl}/posts-last-30-days`, {headers});
  }

  // 5 najpopularnijih objava u poslednjih 7 dana
  getTop5PostsLast7Days(): Observable<any[]> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/top5-posts-last-7-days`, {headers});
  }

  // 10 najpopularnijih objava ikada
  getTop10PostsAllTime(): Observable<any[]> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/top10-posts-all-time`, {headers});
  }

  // 10 korisnika koji su podelili najviše lajkova u poslednjih 7 dana
  getTop10UsersLikesLast7Days(): Observable<any[]> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/top10-users-likes-last-7-days`, {headers});
  }
}
