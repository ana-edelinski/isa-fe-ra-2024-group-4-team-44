import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupService } from '../services/group.service';
import { GroupResponseDTO } from '../model/group-response.model';
import { SelectUsersDialogComponent } from '../select-users-dialog/select-users-dialog.component';
import { SimpleUserDTO } from '../model/simple-user-dto';
import { AuthService } from '../auth/auth.service';
import { ChatService, ChatMessageDTO } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { ElementRef, ViewChild } from '@angular/core';

interface ChatMessage { 
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnInit, OnDestroy {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  chatList: GroupResponseDTO[] = [];
  activeChat: GroupResponseDTO | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  isAdmin = false;
  currentUserId: number | null = null;
  currentUserName: string | null = null;
  selectedUsers: SimpleUserDTO[] = [];
  allUsers: SimpleUserDTO[] = [];
  wsConnected = false;

  private messageSubscription: Subscription | null = null;

  constructor(
    private dialog: MatDialog,
    private groupService: GroupService,
    private authService: AuthService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getLoggedInUserId();
    this.currentUserName = this.authService.getLoggedInUsername();
    this.loadGroups();
    this.loadUsers();
  }

  loadGroups() {
    this.groupService.getMyGroups().subscribe({
      next: (groups) => {
        this.chatList = groups;
      },
      error: (err) => console.error('Error loading groups:', err)
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: (err) => console.error('Error loading users:', err)
    });
  }

  maxVisibleUsers = 3;

  toggleUser(user: SimpleUserDTO) {
    if (this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  selectChat(chat: GroupResponseDTO) {
    this.activeChat = chat;
    this.isAdmin = chat.creatorId === this.currentUserId;
    this.loadMessages(chat.id);
  }

  loadMessages(chatId: number) {
    this.messages = [];

    if (!this.currentUserId) {
      console.error('User ID not found!');
      return;
    }

    // 1. REST poziv za istoriju za ovog korisnika
    this.chatService.getHistoryForUser(chatId, this.currentUserId).subscribe({
      next: (msgs) => {
        this.messages = msgs.map(dto => this.mapDtoToChatMessage(dto));
        this.scrollToBottom();
      },
      error: (err) => console.error('Error loading messages:', err)
    });

    // 2. WebSocket
    if (this.wsConnected) {
      this.chatService.disconnect();
      this.wsConnected = false;
    }

    this.chatService.connect(chatId);
    this.wsConnected = true;

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    this.messageSubscription = this.chatService.getMessages().subscribe((msg) => {
      this.messages.push(this.mapDtoToChatMessage(msg));
      this.scrollToBottom(); 
    });
  }


  sendMessage() {
    if (!this.newMessage.trim() || !this.activeChat) return;

    if (this.currentUserId === null || !this.currentUserName) {
      console.error('User not logged in!');
      return;
    }

    const chatMessage: ChatMessageDTO = {
      content: this.newMessage,
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      groupId: this.activeChat.id
    };

    this.chatService.sendMessage(chatMessage);
    this.newMessage = '';
  }

  openAdminPanel() {
    const active = this.activeChat;
    if (!active) {
      console.warn('No active chat selected.');
      return;
    }

    this.dialog.open(SelectUsersDialogComponent, {
      width: '400px',
      data: {
        users: this.allUsers,
        preselected: this.allUsers.filter(u => active.memberIds.includes(u.id)),
        currentUserId: this.currentUserId
      }
    }).afterClosed().subscribe((selected: SimpleUserDTO[] | undefined) => {
      if (!selected) {
        console.log('User cancelled dialog');
        return;
      }

      const newMemberIds = selected.map(u => u.id);

      if (this.currentUserId !== null && !newMemberIds.includes(this.currentUserId)) {
        newMemberIds.push(this.currentUserId);
      }

      this.groupService.updateGroupMembers(active.id, newMemberIds).subscribe({
        next: () => {
          console.log('Group members updated!');
          active.memberIds = newMemberIds;
        },
        error: (err) => console.error('Error updating group members:', err)
      });
    });
  }

  openCreateGroup() {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '600px',
      height: '400px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New Group Created (from dialog):', result);
        this.chatList.push(result);
      }
    });
  }

  private mapDtoToChatMessage(dto: ChatMessageDTO): ChatMessage {
    return {
      senderId: dto.senderId,
      senderName: dto.senderName,
      content: dto.content,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date()
    };
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }


  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.chatService.disconnect();
  }
}
