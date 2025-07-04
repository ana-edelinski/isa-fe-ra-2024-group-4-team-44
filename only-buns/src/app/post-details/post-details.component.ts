import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';
import { User } from '../profile/user.model';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostEditComponent } from './post-edit/post-edit.component';
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
  post: Post | null = null;
  likesCount: number = 0;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, private authService: AuthService, private dialog: MatDialog) {}
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
          this.post.imagePath = `${this.post.imagePath}?timestamp=${new Date().getTime()}`;
          this.likesCount = data.likeCount;
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

  onEdit(): void {
    if (this.post) {
      //this.router.navigate(['/post', this.post.id, 'edit']); 
      const dialogRef = this.dialog.open(PostEditComponent, {
        width: '50vw',
        height: '55vh',
        data: { post: this.post } 
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.updatedPost) {
          this.post = result.updatedPost;
        }
      });
    }
  }

  onDelete(): void {
    if (this.post) {
      const userId = this.authService.getLoggedInUserId(); 
      if (userId) {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
          this.postService.deletePost(this.post.id, userId).subscribe(
            () => {
              console.log('Post deleted successfully');
              this.router.navigate(['/my-posts']); 
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

  likeUnlikePost(postId: number): void {
    const loggedInUserId = this.authService.getLoggedInUserId();
    if (loggedInUserId) {
      this.postService.likeUnlikePost(postId, loggedInUserId).subscribe(
        () => {
          console.log('Post liked/unliked successfully');
          if (this.post) {
            this.postService.getPostById(postId).subscribe(
              (updatedPost) => {
                this.post!.likeCount = updatedPost.likeCount; // Ažuriraj post.likeCount
                this.likesCount = updatedPost.likeCount; // Ažuriraj lokalni likesCount
              },
              (error) => console.error('Error fetching updated post:', error)
            );
          }
        },
        (error) => {
          console.error('Error liking/unliking post:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
  }
  
  goToProfile(creatorId: number): void {

    this.router.navigate(['/user'], { queryParams: { userId: creatorId } });
  }
}
