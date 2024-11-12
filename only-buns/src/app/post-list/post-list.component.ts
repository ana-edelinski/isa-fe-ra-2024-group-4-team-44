import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth/auth.service';
import { Post } from '../model/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private postService: PostService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {} 
  
  posts: Post[] = [];

  
  
  ngOnInit(): void {
    this.getPosts();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  getPosts(): void {
    this.postService.getAll().subscribe(
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

  likePost(): void {
    if (this.isLoggedIn) {
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
    this.snackBar.open('You must be logged in to like or comment.', 'OK', {
      duration: 3000,
    });
  }
  
  goToProfile(creatorId: number): void {

    this.router.navigate(['/user'], { queryParams: { userId: creatorId } });
  }

}
