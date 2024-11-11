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
  
  //posts: Post[] = [];

  posts: Post[] = [
    {
      id: 1,
      creatorId: 1,
      creatorUsername: 'john_doe',
      description: 'This is a sample post description. It describes the content of the post.',
      creationTime: new Date('2024-11-09T08:30:00'),
      imagePath: 'C:\Users\PC\Desktop\a.jpeg',
      locationStreet: '123 Main St',
      locationCity: 'New York',
      locationPostalCode: '10001',
      comments: [], // Placeholder comments
      likes: [] // Placeholder likes
    },
    {
      id: 2,
      creatorId: 2,
      creatorUsername: 'jane_smith',
      description: 'Another example post with a description.',
      creationTime: new Date('2024-11-08T14:00:00'),
      imagePath: 'C:\Users\PC\Desktop\a.jpeg',
      locationStreet: '456 Oak St',
      locationCity: 'San Francisco',
      locationPostalCode: '94105',
      comments: [], // Placeholder comments
      likes: [] // Placeholder likes
    },
    {
      id: 3,
      creatorId: 3,
      creatorUsername: 'mark_jones',
      description: 'A third example post to test.',
      creationTime: new Date('2024-11-07T19:45:00'),
      imagePath: 'C:\Users\PC\Desktop\a.jpeg',
      locationStreet: '789 Pine St',
      locationCity: 'Los Angeles',
      locationPostalCode: '90001',
      comments: [], // Placeholder comments
      likes: [] // Placeholder likes
    }
  ];
  
  ngOnInit(): void {
    //this.getPosts();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  getPosts(): void {
    this.postService.getAll().subscribe({
      next: (result: Post[]) => {
        this.posts = result;
        console.log(result)
      },
      error: () => {
        console.log("There has been an error loading posts.")
      }
    })
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
