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
export class UserChatComponent {
  constructor(private dialog: MatDialog) { }

  chatList = [
    { id: 1, name: 'Family Chat', lastMessage: 'Hello there!' },
    { id: 2, name: 'Work Group', lastMessage: 'Meeting at 3pm' }
  ];

  activeChat: any = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUserId = 1;
  isAdmin = true;

  selectChat(chat: any) {
    this.activeChat = chat;
    this.loadMessages(chat.id);
  }

  loadMessages(chatId: number) {
    // MOCK: last 10 messages
    this.messages = [
      { senderId: 1, senderName: 'You', content: 'Hello!', timestamp: new Date() },
      { senderId: 2, senderName: 'Ana', content: 'Hi!', timestamp: new Date() }
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

  openCreateGroup() {
  const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
    width: '600px',
    height: '400px',
    maxWidth: '90vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('New Group Created:', result);
      // Pozovi backend servis da napravi grupu
    }
  });
}

  openAdminPanel() {
    console.log('Open Admin Panel');
  }

  
}
