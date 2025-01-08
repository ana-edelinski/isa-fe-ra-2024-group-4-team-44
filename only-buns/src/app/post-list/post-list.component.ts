import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth/auth.service';
import { Post } from '../model/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, MatIconModule,  MatCardModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private postService: PostService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {} 
  
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

  commentOnPost(): void {
    if (this.isLoggedIn) {
    } else {
      this.showLoginNotification();
    }
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
