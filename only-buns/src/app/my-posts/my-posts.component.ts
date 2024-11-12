import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';
import { User } from '../profile/user.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, MatCardModule]
})
export class MyPostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;
  imageUrl: string = '';
  likesCount: number = 0;


  constructor(private postService: PostService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user;
        this.getPosts();
      } else {
        this.router.navigate(['/login']);
      }
    });


  }

  getPosts(): void {
    this.postService.getPostsByUserId().subscribe(
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
  
  

  viewDetails(postId: number) {
    this.router.navigate(['/post-details', postId]);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadLikesCount(postId: number): void {
    this.postService.getLikesCount(postId).subscribe(
      (count) => this.likesCount = count,
      (error) => console.error('Error fetching likes count:', error)
    );
  }

  getImageUrl(post: Post): string {
    return `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
  }

  likeUnlikePost(postId: number): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.postService.likeUnlikePost(postId, userId).subscribe(
        () => {
          console.log('Post liked/unliked successfully');
          this.loadLikesCount(postId); // Ponovo učitaj broj lajkova nakon promene
        },
        (error) => {
          console.error('Error liking/unliking post:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
  }
  
  
}
