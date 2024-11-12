import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './user.model';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserInfoDTO } from '../model/user.model';


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
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/registered`);
  }

  searchUsers(searchCriteria: any): Observable<UserInfoDTO[]> {
    let params = new HttpParams();

    if (searchCriteria.name) {
      params = params.set('name', searchCriteria.name);
    }
    if (searchCriteria.surname) {
      params = params.set('surname', searchCriteria.surname);
    }
    if (searchCriteria.email) {
      params = params.set('email', searchCriteria.email);
    }
    if (searchCriteria.minPosts !== null) {
      params = params.set('minPosts', searchCriteria.minPosts);
    }
    if (searchCriteria.maxPosts !== null) {
      params = params.set('maxPosts', searchCriteria.maxPosts);
    }

    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/search`, { params });
  }

  getUsersSortedByFollowingAsc(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/sort/following/asc`);
  }

  getUsersSortedByFollowingDesc(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/sort/following/desc`);
  }

  getUsersSortedByEmailAsc(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/sort/email/asc`);
  }

  getUsersSortedByEmailDesc(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/sort/email/desc`);
  }
  
  
}
