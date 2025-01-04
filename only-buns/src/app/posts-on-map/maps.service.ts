import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface LocationMessage {
  id: number;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private baseUrl = 'http://localhost:8080/api/message';

  constructor(private http: HttpClient) { }

  getAllLocationMessages(): Observable<LocationMessage[]> {
    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    return this.http.get<LocationMessage[]>(`${this.baseUrl}/locations`, {headers});
  }

}
