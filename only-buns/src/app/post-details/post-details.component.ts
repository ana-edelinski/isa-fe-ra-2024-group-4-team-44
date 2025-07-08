import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../model/post.model';
import { User } from '../profile/user.model';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PostEditComponent } from './post-edit/post-edit.component';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommentService } from '../services/comment.service';
import { Comment } from '../model/post.model';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIcon, FormsModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  likesCount: number = 0;
  newCommentText: string = '';

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, private authService: AuthService, private dialog: MatDialog, private commentService:CommentService) {}
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
          this.post.comments.sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());
        },
        (error) => console.error('Error fetching post details:', error)
      );
    }
  }


  commentOnPost(post: Post): void {
      const newComment: Comment = {
          id: 100,
          text: this.newCommentText,
          creationTime: new Date(),
          userId: 100,
          username: "",
          postId: post.id         
          };
      this.commentService.createComment(newComment).subscribe({
            next: (result: Comment) => {
              if (result) {
                this.newCommentText = "";
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Comment posted successfully!',
                  confirmButtonColor: '#28705e'
                });
                post.comments.unshift(result);
              } else {
                alert('An error has occurred. Please try again.');
              }
            },
            error: (err) => {
              console.error('Error adding comment:', err);
              if (err.status === 429) {
                Swal.fire(
                  'Limit Exceeded',
                  'You have exceeded the comment limit of 60 per hour. Please try again later.',
                  'warning'
                );
              } else {
                Swal.fire(
                  'Oops...',
                  'An error occurred. Please try again.',
                  'error'
                );
              }
            }
          });
      
      
  
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
