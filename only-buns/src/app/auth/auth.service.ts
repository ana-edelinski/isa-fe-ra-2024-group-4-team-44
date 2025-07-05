import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../profile/user.model';
import { LoginResponse } from './model/login_response.model';
import { SimpleUserDTO } from '../model/simple-user-dto';

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
          this.fetchUserProfile(userId);
          this.loggedIn = true;
        
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userDto: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userDto).pipe(
      map(response => {
        const expirationDate = new Date(new Date().getTime() + response.expiresIn);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('expiresIn', expirationDate.toString());
        localStorage.setItem('userId', response.userId.toString());
        this.loggedIn = true;
        this.fetchUserProfile(response.userId);
        return response;
      })
    );
  }
  

   getHeaders(): HttpHeaders {
      const token = this.getAuthToken();
      return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }

    getUserProfile(): Observable<User | null> {
      const userId = this.getStoredUserId();
      if (userId !== null) {
        return this.http.get<User>(`${this.apiUrl}/${userId}/profile`, { headers: this.getHeaders() });
      } else {
       
        return new Observable<User | null>((observer) => {
          observer.next(null); // Vraća null ako nema user ID
          observer.complete();
        });
      }
    }
    
  

    isAuthenticated(): boolean {
      if (typeof window !== 'undefined' && localStorage) {
        const token = this.getAuthToken();
        const expiresIn = localStorage.getItem('expiresIn');
        if (token && expiresIn) {
          const expirationDate = new Date(expiresIn);
          return expirationDate > new Date();
        }
      }
      return false;
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
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getStoredUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
  getLoggedInUserId(): number | null {
    const user = this.user$.getValue();
    return user ? (user.id as number | null) : null;
}

  getProfileByUserId(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  private fetchUserProfile(userId: number): void {
    this.getProfileByUserId(userId).subscribe(
      (user) => this.user$.next(user),
      (error) => console.error('Error fetching user profile after login:', error)
    );
  }

  isFollowingUser(targetUserId: number): Observable<boolean> {
    const currentUserId = this.getStoredUserId(); 
    if (!currentUserId) {
      throw new Error('User is not logged in');
    }
  
    return this.http.get<boolean>(`${this.apiUrl}/${currentUserId}/isFollowing/${targetUserId}`, {
      headers: this.getHeaders(),
    });
  }
  

  followUser(followingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/follow/${followingId}`, null, {
      headers: this.getHeaders(),
    });
  }

  unfollowUser(followingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/unfollow/${followingId}`, null, {
      headers: this.getHeaders(),
    });
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/followers`, {
      headers: this.getHeaders(),
    });
  }
  
  getFollowing(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/following`, {
      headers: this.getHeaders(),
    });
  }
  
  get userObservable(): Observable<User | null> {
    return this.user$.asObservable();
  }  

  getAllUsers(): Observable<SimpleUserDTO[]> {
    return this.http.get<SimpleUserDTO[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getLoggedInUsername(): string | null {
    const user = this.user$.getValue();
    return user ? user.username : null;
  }


}

