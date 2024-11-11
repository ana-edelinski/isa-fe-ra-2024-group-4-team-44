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
  searchCriteria = {
    name: '',
    surname: '',
    email: '',
    minPosts: null,
    maxPosts: null
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
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
    this.fetchUsers();  // Reset to original list
  }


}

