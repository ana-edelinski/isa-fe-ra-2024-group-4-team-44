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

interface GroupUser {
  id: number;
  name: string;
}

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
  selectedUsers: GroupUser[] = [];
  allUsers: GroupUser[] = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Marko' },
    { id: 3, name: 'Jovana' },
    { id: 4, name: 'Stefan' },
    { id: 5, name: 'Milica' },
    { id: 6, name: 'Nikola' },
    { id: 7, name: 'Petar' },
    { id: 8, name: 'Marija' },
    { id: 9, name: 'Vladimir' },
    { id: 10, name: 'Ivana' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private dialog: MatDialog
  ) {}

  maxVisibleUsers = 3;

  toggleUser(user: GroupUser) {
    if (this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  createGroup() {
    const group = {
      name: this.groupName,
      users: this.selectedUsers
    };
    this.dialogRef.close(group);
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
