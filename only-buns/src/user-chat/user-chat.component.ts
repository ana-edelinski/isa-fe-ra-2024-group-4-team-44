import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupService } from '../services/group.service';
import { GroupResponseDTO } from '../app/model/group-response.model';
import { OnInit } from '@angular/core';
import { SelectUsersDialogComponent } from '../select-users-dialog/select-users-dialog.component';
import { SimpleUserDTO } from '../app/model/simple-user-dto';
import { AuthService } from '../app/auth/auth.service';


//TODO: premesti u model
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
export class UserChatComponent implements OnInit {
  chatList: GroupResponseDTO[] = [];

  currentUserId = 1; // Pretpostavimo da je logovani user sa ID 1 (demo - menjace se posle)
  activeChat: GroupResponseDTO | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  isAdmin = true; // Pretpostavimo da je logovani user kreirao sve grupe (demo - menjace se posle)
  selectedUsers: SimpleUserDTO[] = [];
  allUsers: SimpleUserDTO[] = [];

  constructor(private dialog: MatDialog,
              private groupService: GroupService,
              private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.chatList = groups;
      },
      error: (err) => {
        console.error('Error loading groups:', err);
      }
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
  this.loadMessages(chat.id);
}

  loadMessages(chatId: number) {
    // MOCK DATA
    this.messages = [
      { senderId: 1, senderName: 'You', content: 'Hello everyone!', timestamp: new Date() },
      { senderId: 2, senderName: 'Ana', content: 'Hi! How are you?', timestamp: new Date() },
      { senderId: 1, senderName: 'You', content: 'I\'m good, thanks!', timestamp: new Date() },
    ];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        senderId: this.currentUserId,
        senderName: 'You',
        content: this.newMessage,
        timestamp: new Date()
      });
      this.newMessage = '';
    }
  }

  openAdminPanel() {
  console.log('Opening dialog with users:', this.allUsers);
  this.dialog.open(SelectUsersDialogComponent, {
    width: '400px',
    data: {
      users: this.allUsers,
      preselected: []
    }
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
      console.log('New Group Created:', result);
      this.groupService.createGroup(result).subscribe({
        next: (newGroup) => {
          console.log('Group saved on server:', newGroup);
          this.chatList.push(newGroup);  // dodaj u prikazanu listu!
        },
        error: (err) => {
          console.error('Error saving group:', err);
        }
      });
    }
  });
}
  
}
