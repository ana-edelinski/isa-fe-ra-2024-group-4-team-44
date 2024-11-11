import { Component, OnInit } from '@angular/core';
import { User } from '../../profile/user.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  user: User = { name: '', surname: '', email: '', username: '' };

  constructor(
    private route: ActivatedRoute,
    private authService : AuthService
  ) {
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = +params['userId'];
      if (userId) {
        this.fetchUserProfile(userId);
      }
    });
  }
  fetchUserProfile(userId: number): void {
    this.authService.getProfileByUserId(userId).subscribe((data) => {
      this.user = data;
    });
  }
}
