import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationMessageService {
  private apiUrl = 'http://localhost:8082/api/spring-boot1';

  constructor(private http: HttpClient) { }

  sendLocation(locationData: any): Observable<any> {
    return this.http.post(this.apiUrl, locationData);
  }
}
