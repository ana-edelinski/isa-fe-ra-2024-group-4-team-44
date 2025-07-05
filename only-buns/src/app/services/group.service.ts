import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupRequestDTO } from '../model/group-request.model';
import { GroupResponseDTO } from '../model/group-response.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8080/api/groups';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createGroup(group: GroupRequestDTO): Observable<GroupResponseDTO> {
    const headers = this.authService.getHeaders();
    return this.http.post<GroupResponseDTO>(this.apiUrl, group, { headers });
  }

  getAllGroups(): Observable<GroupResponseDTO[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<GroupResponseDTO[]>(this.apiUrl, { headers });
  }

  updateGroupMembers(groupId: number, memberIds: number[]): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.put<void>(`${this.apiUrl}/${groupId}/members`, memberIds, { headers });
  }

  getMyGroups(): Observable<GroupResponseDTO[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<GroupResponseDTO[]>(`${this.apiUrl}/my`, { headers });
  }

}
