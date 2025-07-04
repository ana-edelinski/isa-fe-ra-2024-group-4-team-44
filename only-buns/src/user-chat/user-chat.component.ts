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
  constructor(private dialog: MatDialog,
              private groupService: GroupService
  ) { }

  chatList: GroupResponseDTO[] = [];

  // activeChat: any = null;
  // messages: ChatMessage[] = [];
  // newMessage = '';
  // currentUserId = 1;
  // isAdmin = true;

  ngOnInit(): void {
    this.loadGroups();
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

  // selectChat(chat: any) {
  //   this.activeChat = chat;
  //   this.loadMessages(chat.id);
  // }

  // loadMessages(chatId: number) {
  //   // MOCK: last 10 messages
  //   this.messages = [
  //     { senderId: 1, senderName: 'You', content: 'Hello!', timestamp: new Date() },
  //     { senderId: 2, senderName: 'Ana', content: 'Hi!', timestamp: new Date() }
  //   ];
  // }

  // sendMessage() {
  //   if (this.newMessage.trim()) {
  //     this.messages.push({
  //       senderId: this.currentUserId,
  //       senderName: 'You',
  //       content: this.newMessage,
  //       timestamp: new Date()
  //     });
  //     this.newMessage = '';
  //   }
  // }

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

  openAdminPanel() {
    console.log('Open Admin Panel');
  }

  
}
