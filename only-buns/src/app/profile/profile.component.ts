import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './user.model';
import { UserService } from './profile.service';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, 
    FormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit,  OnDestroy{

  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;
  loggedInUserId: number  | null = null;
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getUserProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getUserProfile(): void {
    this.userSubscription = this.authService.getUserProfile().subscribe(
      (data) => {
        if (data) {
          this.user = data;
          console.log('User profile fetched successfully', data);
        } else {
          console.error('No user profile data available');
        }
      },
      (error) => {
        console.error('Error fetching user profile', error);
        this.router.navigate(['/login']);
      }
    );
  }
  
  updateProfile(): void {
    if (this.user.id !== undefined && this.user.id !== null) {  
      this.userService.updateUserProfile(this.user.id, this.user).subscribe(
        () => alert('Profile updated successfully'),
        (error) => console.error('Error updating profile', error)
      );
    } else {
      console.error('User ID is not available');
    }
  }
  

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
  
    if (this.user.id !== null && this.user.id !== undefined) {
      this.userService.changePassword(this.user.id, this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
        () => alert('Password changed successfully'),
        (error) => console.error('Error changing password', error)
      );
    } else {
      console.error('User ID is not defined');
    }
  }
  
  
  
}