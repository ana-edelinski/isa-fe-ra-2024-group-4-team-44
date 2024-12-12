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

  constructor(
    private route: ActivatedRoute,
    private authService : AuthService,
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = +params['userId'];
      if (userId) {
        this.fetchUserProfile(userId);
        this.fetchUserPosts(userId); 
      }
    });
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
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.postService.likeUnlikePost(postId, userId).subscribe(
        () => {
          console.log('Post liked/unliked successfully');
          this.fetchUserPosts(userId); // Osvesti postove nakon promene
        },
        (error) => {
          console.error('Error liking/unliking post:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
  }
  
  viewDetails(postId: number): void {
    this.router.navigate(['post-details', postId]);
  }
  
  
}
