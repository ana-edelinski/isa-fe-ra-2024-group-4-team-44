import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from './model/login_response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  private apiUrl = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials);
  // }
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn = true; 
        }
      })
    );
  }
  isAuthenticated(): boolean {

    if (typeof window !== 'undefined') {
      return this.loggedIn || !!localStorage.getItem('token');
    }
    return false; 
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.loggedIn = false;
  }
}
