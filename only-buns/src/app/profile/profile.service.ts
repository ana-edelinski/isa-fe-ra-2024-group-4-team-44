import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { UserInfoDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}/profile`);
  }

  updateUserProfile(userId: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}/profile`, user);
  }

  changePassword(userId: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };
  
    return this.http.put(`${this.baseUrl}/${userId}/changePassword`, passwordData, { responseType: 'text' });
  }

  getAllUsers(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.baseUrl}/registered`);
  }
  
  
}
