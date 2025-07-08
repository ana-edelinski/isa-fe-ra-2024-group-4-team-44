import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth/auth.service';
import { Post } from '../model/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommentService } from '../services/comment.service';
import { Comment } from '../model/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, MatIconModule,  MatCardModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {

  isLoggedIn: boolean = false;
  isAddingComment: boolean = false;
  newCommentText: string = '';
  

  constructor(private postService: PostService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private commentService: CommentService) {} 
  
  posts: Post[] = [];
  likesCount: number = 0;
  
  ngOnInit(): void {
    this.authService.userObservable.subscribe(user => {
      this.isLoggedIn = this.authService.isAuthenticated();
      console.log('Is logged in:', this.isLoggedIn);
      console.log('Logged in user:', user);
  
      if (this.isLoggedIn && user) {
        this.getPosts(user.id); 
      } else {
        this.getPosts(); 
      }
    });
  }  
  
  getPosts(userId?: number): void {
    if (this.isLoggedIn && userId) {
      this.postService.getPostsFromFollowing(userId).subscribe(
        (data: Post[]) => {
          this.posts = data;
          this.posts.forEach(post => {
            post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
            post.comments.sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());
            post.newCommentText = '';
            post.showCommentBox = false;
          });
          console.log('Fetched posts from following:', this.posts);
        },
        (error) => {
          console.error('Error fetching posts from following:', error);
        }
      );
    } else {
      this.postService.getAll().subscribe(
        (data: Post[]) => {
          this.posts = data;
          this.posts.forEach(post => {
            post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
          });
          console.log('Fetched all posts:', this.posts);
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
    }
  }

  likePost(postId: number): void {
    if (this.isLoggedIn) {
      const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.postService.likeUnlikePost(postId, userId).subscribe(
        () => {
          console.log('Post liked/unliked successfully');
          this.ngOnInit()
        },
        (error) => {
          console.error('Error liking/unliking post:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
    } else {
      this.showLoginNotification();
    }
  }

  commentOnPost(post: Post): void {
    if (this.isLoggedIn) {
    } else {
      this.showLoginNotification();
    }
    const newComment: Comment = {
        id: 100,
        text: post.newCommentText || "",
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
              post.showCommentBox = false;
            } else {
              alert('An error has occurred. Please try again.');
            }
          },
          error: (err) => {
            console.log("Error adding comment:", err);
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

  showLoginNotification(): void {
    Swal.fire({
      icon: 'warning',
      title: 'You must be logged in',
      text: 'Please log in to like or comment.',
      confirmButtonText: 'OK'
    });
  }
  
  showDetails(postId: number): void {
    this.router.navigate(['/post-details', postId]);
  }

  goToProfile(creatorId: number): void {

    this.router.navigate(['/user'], { queryParams: { userId: creatorId } });
  }
  // viewDetails(postId: number) {
  //   this.router.navigate(['post-details', postId], { relativeTo: this.router.routerState.root });
  // }
  viewDetails(postId: number) {
    if (this.isLoggedIn) {
      this.router.navigate(['post-details', postId], { relativeTo: this.router.routerState.root });
    } else {
      this.showLoginNotification();
    }
  }
  

}
