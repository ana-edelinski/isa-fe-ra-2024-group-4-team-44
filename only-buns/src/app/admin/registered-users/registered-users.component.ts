import { Component, OnInit } from '@angular/core';
import { UserService } from '../../profile/profile.service';
import { UserInfoDTO } from '../../model/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registered-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.css'
})
export class RegisteredUsersComponent implements OnInit {
  users: UserInfoDTO[] = [];
  filteredUsers: UserInfoDTO[] = [];

  searchCriteria = {
    name: '',
    surname: '',
    email: '',
    minPosts: null,
    maxPosts: null
  };

  sortCriteria = {
    emailAsc: true,
    emailDesc: false,
    followingAsc: false,
    followingDesc: false
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  searchUsers(): void {
    this.userService.searchUsers(this.searchCriteria).subscribe(
      (data) => {
        console.log('Search results:', data);
        this.users = data;
        this.filteredUsers = data;
        console.log('Updated users:', this.users);
      },
      (error) => {
        console.error('Error searching users:', error);
      }
    );
  }

  clearSearch(): void {
    this.searchCriteria = {
      name: '',
      surname: '',
      email: '',
      minPosts: null,
      maxPosts: null
    };
    this.fetchUsers();  
  }

  sortBy(key: string): void {
    if (key === 'email') {
      if (this.sortCriteria.emailAsc) {
        this.userService.getUsersSortedByEmailDesc().subscribe(data => {
          this.filteredUsers = data;
          this.sortCriteria.emailAsc = false;
          this.sortCriteria.emailDesc = true;
          console.log(data);
        });
      } else {
        this.userService.getUsersSortedByEmailAsc().subscribe(data => {
          this.filteredUsers = data;
          this.sortCriteria.emailAsc = true;
          this.sortCriteria.emailDesc = false;
        });
      }
    } else if (key === 'following') {
      if (this.sortCriteria.followingAsc) {
        this.userService.getUsersSortedByFollowingDesc().subscribe(data => {
          this.filteredUsers = data;
          this.sortCriteria.followingAsc = false;
          this.sortCriteria.followingDesc = true;
        });
      } else {
        this.userService.getUsersSortedByFollowingAsc().subscribe(data => {
          this.filteredUsers = data;
          this.sortCriteria.followingAsc = true;
          this.sortCriteria.followingDesc = false;
        });
      }
    }
  }

}

