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
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;
  sortField: string = 'id';
  sortDirection: string = 'asc';

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
    this.userService.getAllUsersPaged(this.currentPage, this.pageSize).subscribe(
      data => {
        this.users = data.content; 
        this.totalPages = data.totalPages;
      },
      error => console.error('Error fetching users:', error)
    );
  }
  
  searchUsers(): void {
    this.userService.searchUsers(this.searchCriteria, this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe(
      (data) => {
        this.users = data.content;
        this.totalPages = data.totalPages;
        console.log('Sorted Search results:', data);
      },
      (error) => console.error('Error searching users:', error)
    );
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.fetchUsers();
    }
  }

  clearSearch(): void {
    this.searchCriteria = { name: '', surname: '', email: '', minPosts: null, maxPosts: null };
    this.currentPage = 0;
    this.fetchUsers();
  }

  sortBy(key: string): void {
    if (this.sortField === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = key;
      this.sortDirection = 'asc';
    }  
    this.searchUsers();
  }

}

