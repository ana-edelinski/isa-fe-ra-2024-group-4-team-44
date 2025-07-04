import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SelectUsersDialogComponent } from '../select-users-dialog/select-users-dialog.component';
import { SimpleUserDTO } from '../app/model/simple-user-dto';
import { AuthService } from '../app/auth/auth.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-create-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.css']
})
export class CreateGroupDialogComponent {
  groupName = '';
  selectedUsers: SimpleUserDTO[] = [];
  allUsers: SimpleUserDTO[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    this.loadUsers();
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

  createGroup() {
  if (!this.groupName || this.selectedUsers.length === 0) {
    return;
  }

  const request = {
    name: this.groupName,
    memberIds: this.selectedUsers.map(u => u.id)
  };

  this.groupService.createGroup(request).subscribe({
    next: (response) => {
      console.log('Group created:', response);
      this.dialogRef.close(response);
    },
    error: (err) => {
      console.error('Error creating group:', err);
      // Možeš prikazati i poruku korisniku
    }
  });
}

  cancel() {
    this.dialogRef.close();
  }

  get visibleUsers() {
    return this.allUsers.slice(0, this.maxVisibleUsers);
  }

  get hasMoreUsers() {
    return this.allUsers.length > this.maxVisibleUsers;
  }

  openMoreUsersDialog() {
  const dialogRef = this.dialog.open(SelectUsersDialogComponent, {
    width: '400px',
    data: {
      users: this.allUsers,
      preselected: this.selectedUsers
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.selectedUsers = result;
    }
  });
}



}
