import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';
import { User } from '../profile/user.model';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  //post$: Observable<Post> | null = null;
  post: Post | null = null;
  imageUrl: string = '';
  likesCount: number = 0;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, private authService: AuthService) {}
  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user; 
      } else {
        this.router.navigate(['/login']);
      }
    });

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      const id = +postId;
      this.postService.getPostById(id).subscribe(
        (data: Post) => {
          this.post = data;
          this.imageUrl = `http://localhost:8080${this.post.imagePath}?timestamp=${new Date().getTime()}`;
          this.loadLikesCount(id);
        },
        (error) => console.error('Error fetching post details:', error)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getImageUrl(post: Post): string {
    return `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
  }

  loadLikesCount(postId: number): void {
    this.postService.getLikesCount(postId).subscribe(
      (count) => this.likesCount = count,
      (error) => console.error('Error fetching likes count:', error)
    );
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/post', this.post.id, 'edit']); 
    }
  }

  onDelete(): void {
    if (this.post) {
      const userId = this.authService.getLoggedInUserId(); // Get the logged-in user's ID
      if (userId) {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
          this.postService.deletePost(this.post.id, userId).subscribe(
            () => {
              console.log('Post deleted successfully');
              this.router.navigate(['/my-posts']); // Redirect to home or another page
            },
            (error) => {
              console.error('Error deleting post:', error);
              alert('Failed to delete the post');
            }
          );
        }
      } else {
        alert('You must be logged in to delete a post');
      }
    }
  }
  
}
