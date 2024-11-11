import { Component, OnInit } from '@angular/core';
import { UserService } from '../../profile/profile.service';
import { UserInfoDTO } from '../../model/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registered-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.css'
})
export class RegisteredUsersComponent implements OnInit {
  users: UserInfoDTO[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
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
}
