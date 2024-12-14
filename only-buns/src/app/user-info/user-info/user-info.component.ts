import { Component, OnInit } from '@angular/core';
import { User } from '../../profile/user.model';
import { Post } from '../../model/post.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../post.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard, RouterModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  user: User = { name: '', surname: '', email: '', username: '' };
  posts: Post[] = [];
  likesCount: number = 0;
  isFollowing: boolean = false;
  isMyProfile: boolean = false;
  followingCount: number = 0; 
  followersCount: number = 0; 
  isModalOpen: boolean = false;
  modalTitle: string = '';
  modalUsers: User[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService : AuthService,
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = +params['userId'];
      if (userId) {
        this.fetchUserProfile(userId);
        this.fetchUserPosts(userId);
  
        if (this.authService.isAuthenticated()) {
          this.checkFollowingStatus(userId);
          this.checkIfMyProfile(userId);
          this.fetchFollowers(userId);
          this.fetchFollowing(userId);
        }
      }
    });
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
          this.loadLikesCount(post.id);
        });
        console.log('Fetched posts:', this.posts);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }  

  loadLikesCount(postId: number): void {
    this.postService.getLikesCount(postId).subscribe(
      (count) => this.likesCount = count,
      (error) => console.error('Error fetching likes count:', error)
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

  checkFollowingStatus(userId: number): void {
    this.authService.isFollowingUser(userId).subscribe(
      (isFollowing) => {
        this.isFollowing = isFollowing; 
      },
      (error) => {
        console.error('Error checking follow status:', error);
      }
    );
  }

  toggleFollow(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('User is not logged in. Follow/unfollow is disabled.');
      return;
    }

    const followingId = this.route.snapshot.queryParamMap.get('userId');
    if (followingId) {
      if (this.isFollowing) {
        Swal.fire({
          title: `Do you really want to unfollow ${this.user.username}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#28705e',
          cancelButtonColor: '#808080',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.authService.unfollowUser(+followingId).subscribe(
              (response) => {
                this.isFollowing = false;
                this.fetchFollowers(+followingId);
              },
              (error) => {
                console.error('Error unfollowing user:', error);
              }
            );
          }
        });
      } else {
        this.authService.followUser(+followingId).subscribe(
          (response) => {
            this.isFollowing = true;
            this.fetchFollowers(+followingId);
          },
          (error) => {
            console.error('Error following user:', error);
          }
        );
      }
    } else {
      console.error('Following ID not found');
    }
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
  
  
}
