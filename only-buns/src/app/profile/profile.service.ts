import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './user.model';
import { UserInfoDTO } from '../model/user.model';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserProfile(userId: number): Observable<User> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.baseUrl}/${userId}/profile`, {headers});
  }

  updateUserProfile(userId: number, user: User): Observable<User> {
    
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put<User>(`${this.baseUrl}/${userId}/profile`, user, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating user profile', error);
          return throwError(() => error);
        })
      );
  }

  changePassword(userId: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };
  
    const headers = this.authService.getHeaders(); // Dodajemo zaglavlje sa tokenom
  
    return this.http.put(`${this.baseUrl}/${userId}/changePassword`, passwordData, { headers, responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error changing password', error);
          return throwError(() => error);
        })
      );
  }

  getAllUsers(): Observable<UserInfoDTO[]> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/registered`, {headers});
  }

  // getRole(userId: number): Observable<number> {
  //   return this.http.get<number>(`${this.baseUrl}/role/` + userId);
  // }

  async getRole(userId: number): Promise<number> {
    return await this.http.get<number>(`${this.baseUrl}/role/` + userId).toPromise() || -1;
  }
  
  getAllUsersPaged(page: number, size: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get<any>(`${this.baseUrl}/paged`, { headers, params });
  }
  
  searchUsers(criteria: any, page: number, size: number, sortField: string, sortDirection: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);
  
    if (criteria.name) params = params.set('name', criteria.name);
    if (criteria.surname) params = params.set('surname', criteria.surname);
    if (criteria.email) params = params.set('email', criteria.email);
    if (criteria.minPosts) params = params.set('minPosts', criteria.minPosts.toString());
    if (criteria.maxPosts) params = params.set('maxPosts', criteria.maxPosts.toString());
  
    return this.http.get<any>(`${this.baseUrl}/search`, { headers, params });
  }
  
}
