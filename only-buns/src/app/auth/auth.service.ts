import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginResponse } from './model/login_response.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../profile/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  private apiUrl = 'http://localhost:8080/api/users';
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (savedUser && token) {
        this.user$.next(JSON.parse(savedUser));        
        this.loggedIn = true;
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token && typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user)); 
          this.user$.next(response.user);
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
      localStorage.removeItem('user');
    }
    this.user$.next(null);
    this.loggedIn = false;
  }

  getLoggedInUserId(): number | null {
    const user = this.user$.getValue();
    return user ? (user.id as number | null) : null;
}

getUser(): Observable<User | null> {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    this.user$.next(JSON.parse(savedUser));
  }

  return this.user$.asObservable();
}
}
