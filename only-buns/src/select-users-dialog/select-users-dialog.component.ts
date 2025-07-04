import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface User {
  id: number;
  username: string;
}

@Component({
  selector: 'app-select-users-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './select-users-dialog.component.html',
  styleUrls: ['./select-users-dialog.component.css']
})
export class SelectUsersDialogComponent {
  dialogRef = inject(MatDialogRef<SelectUsersDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { users: User[], preselected: User[] };

  selectedUsers: User[] = [...this.data.preselected];

  toggleUser(user: User) {
    if (this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isSelected(user: User): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  confirm() {
    this.dialogRef.close(this.selectedUsers);
  }

  cancel() {
    this.dialogRef.close();
  }
}
