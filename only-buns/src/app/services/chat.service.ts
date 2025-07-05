import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
// import * as Stomp from 'stompjs';
// import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../auth/auth.service';

export interface ChatMessageDTO {
  content: string;
  senderId: number;
  senderName: string;
  groupId: number;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private messageSubject = new Subject<ChatMessageDTO>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  connect(groupId: number) {
    const socket = new SockJS(environment.url + 'ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(
        `/topic/group/${groupId}`,
        (message: { body: string }) => {
          const msg: ChatMessageDTO = JSON.parse(message.body);
          this.messageSubject.next(msg);
        }
      );
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  getMessages(): Observable<ChatMessageDTO> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: ChatMessageDTO) {
    this.stompClient.send('/app/group.send', {}, JSON.stringify(message));
  }

  getLast10Messages(groupId: number): Observable<ChatMessageDTO[]> {
    return this.http.get<ChatMessageDTO[]>(`${environment.url}api/groupchat/${groupId}/last10`);
  }

  getAllMessages(groupId: number): Observable<ChatMessageDTO[]> {
    return this.http.get<ChatMessageDTO[]>(
      `${environment.url}api/groupchat/${groupId}/all`,
      { headers: this.authService.getHeaders() }
    );
  }


}
