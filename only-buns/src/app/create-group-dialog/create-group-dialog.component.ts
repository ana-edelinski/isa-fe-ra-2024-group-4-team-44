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
import { SimpleUserDTO } from '../model/simple-user-dto';
import { AuthService } from '../auth/auth.service';
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
  currentUserId: number | null = null;
  
  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.currentUserId = this.authService.getLoggedInUserId();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;

        const loggedInId = this.authService.getLoggedInUserId();
        if (loggedInId == null) {
          console.warn('No logged in user ID!');
          return;
        }

        const alreadySelected = this.selectedUsers.some(u => u.id === loggedInId);

        if (!alreadySelected) {
          const me = users.find(u => u.id === loggedInId);
          if (me) {
            this.selectedUsers.push(me);
          } else {
            console.warn('Logged in user not found in allUsers list!');
          }
        }
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }



  maxVisibleUsers = 3;

toggleUser(user: SimpleUserDTO) {
    const loggedInId = this.authService.getLoggedInUserId();
    if (user.id === loggedInId) {
      return; 
    }

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
      memberIds: this.selectedUsers.map(u => u.id),
      creatorId: this.authService.getLoggedInUserId()
    };

    this.groupService.createGroup(request).subscribe({
      next: (response) => {
        console.log('Group created:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error creating group:', err);
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
        preselected: this.selectedUsers,
        currentUserId: this.currentUserId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.currentUserId !== null && !result.some((u: SimpleUserDTO) => u.id === this.currentUserId)) {
          const me = this.allUsers.find(u => u.id === this.currentUserId);
          if (me) {
            result.push(me);
          }
        }
        this.selectedUsers = result;
      }
    });
  }




}
