import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../profile/user.model';
import { LoginResponse } from './model/login_response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
  private user$ = new BehaviorSubject<User | null>(null);
  public loggedIn = false;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const token = this.getAuthToken();
      const userId = this.getStoredUserId();
      if (token  && userId) {

          this.loggedIn = true;
        
      }
    }
  }

  // Registracija korisnika
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login funkcionalnost - vama treba samo token, ne ceo korisnički objekat
  login(userDto: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userDto).pipe(
      map(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('expiresIn', response.expiresIn.toString());
        localStorage.setItem('userId', response.userId.toString());
        this.loggedIn = true;
        return response;
      })
    );
  }
  

  private getHeaders(): HttpHeaders {
      const token = this.getAuthToken();
      return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }

    getUserProfile(): Observable<User | null> {
      const userId = this.getStoredUserId();
      if (userId !== null) {
        return this.http.get<User>(`${this.apiUrl}/${userId}/profile`, { headers: this.getHeaders() });
      } else {
        console.error("User ID not found in local storage");
        return new Observable<User | null>((observer) => {
          observer.next(null); // Vraća null ako nema user ID
          observer.complete();
        });
      }
    }
    
  

  isAuthenticated(): boolean {
    return this.loggedIn || !!this.getAuthToken();
  }

  // Logout korisnika
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');  // Nema potrebe da čuvate 'user' ako ne vraća backend
       localStorage.removeItem('expiresIn');
    }
    this.user$.next(null);
    this.loggedIn = false;
  }

  // Dohvatanje trenutnog korisnika sa BehaviorSubject
  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

}

