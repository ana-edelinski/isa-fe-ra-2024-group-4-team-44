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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyPostsComponent } from '../my-posts/my-posts.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, 
    FormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    CommonModule,
    MyPostsComponent,
    UserInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit,  OnDestroy{

  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;
  loggedInUserId: number  | null = null;

  showDetails: boolean = false;
  myPostsClick: boolean = false;
  currentView: string = 'posts';
  isFollowing: boolean = false;
  isMyProfile: boolean = false;
  followingCount: number = 0; 
  followersCount: number = 0; 
  isModalOpen = false;
  modalTitle = '';
  modalUsers: User[] = [];
  posts: Post[] = [];

  showSettings: boolean = false;

  constructor(public authService: AuthService,
              private userService: UserService, 
              private router: Router, 
              private route: ActivatedRoute,
              private postService: PostService) {}

  ngOnInit(): void {
  if (this.authService.isAuthenticated()) {
    const loggedInUserId = this.authService.getLoggedInUserId();
    if (loggedInUserId) {
      this.fetchUserProfile(loggedInUserId);
      this.fetchUserPosts(loggedInUserId);
      this.fetchFollowers(loggedInUserId);
      this.fetchFollowing(loggedInUserId);
      this.isMyProfile = true;
    }
  } else {
    this.router.navigate(['/login']);
  }
}


  checkIfMyProfile(userId: number): void {
    const loggedInUserId = this.authService.getLoggedInUserId();
    this.isMyProfile = loggedInUserId === userId;
  }
  
  fetchUserProfile(userId: number): void {
    this.authService.getProfileByUserId(userId).subscribe((data) => {
      this.user = {
        ...data,
        avatar: data.avatar || 'assets/default-avatar.jpg',
        street: data.street || 'Street not provided',
        city: data.city || 'City not provided',
        postalCode: data.postalCode || ''
      };
    });
  }

  fetchUserPosts(userId: number): void {
      this.postService.getPostsBySpecificUser(userId).subscribe(
        (data: Post[]) => {
          this.posts = data;
          this.posts.forEach(post => {
            post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
          });
          console.log('Fetched posts:', this.posts);
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
    }  
  
    likeUnlikePost(postId: number): void {
      if (!this.authService.isAuthenticated()) {
        console.warn('User is not logged in. Liking/unliking is disabled.');
        this.router.navigate(['/login']);
        return;
      }
    
      const loggedInUserId = this.authService.getLoggedInUserId();
      if (loggedInUserId) {
        this.postService.likeUnlikePost(postId, loggedInUserId).subscribe(
          () => {
            console.log('Post liked/unliked successfully');
            this.fetchUserPosts(this.user.id as number);
          },
          (error) => {
            console.error('Error liking/unliking post:', error);
          }
        );
      }
    }

    viewDetails(postId: number): void {
    this.router.navigate(['post-details', postId]);
  }

  fetchFollowers(userId: number): void {
    this.authService.getFollowers(userId).subscribe(
      (followers) => {
        this.followersCount = followers.length; 
      },
      (error) => {
        console.error('Error fetching followers:', error);
      }
    );
  }
  
  fetchFollowing(userId: number): void {
    this.authService.getFollowing(userId).subscribe(
      (following) => {
        this.followingCount = following.length; 
      },
      (error) => {
        console.error('Error fetching following:', error);
      }
    );
  }

  showModal(type: 'followers' | 'following'): void {
    this.isModalOpen = true;
    if (type === 'followers') {
      this.modalTitle = 'Followers';
      this.authService.getFollowers(this.user.id as number).subscribe(
        (followers) => {
          this.modalUsers = followers;
        },
        (error) => {
          console.error('Error fetching followers:', error);
        }
      );
    } else if (type === 'following') {
      this.modalTitle = 'Following';
      this.authService.getFollowing(this.user.id as number).subscribe(
        (following) => {
          this.modalUsers = following;
        },
        (error) => {
          console.error('Error fetching following:', error);
        }
      );
    }
  }

  navigateToProfile(userId: number | undefined): void {
    console.log('Navigating to profile with ID:', userId);
    if (userId !== undefined) {
      this.closeModal(); 
      this.router.navigate(['/user'], { queryParams: { userId: userId } });
    } else {
      console.error('User ID is undefined.');
    }
  }
  
  
  closeModal(): void {
    this.isModalOpen = false;
  }

    toggleSettings() {
      this.showSettings = !this.showSettings;
    }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
