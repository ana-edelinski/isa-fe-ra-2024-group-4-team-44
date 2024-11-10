import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Post, Comment } from '../model/post.model';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  post: Post | null = null;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPostById(+postId).subscribe(
        (data: Post) => {
          this.post = data;
          if (!this.post.comments) {
            this.post.comments = []; // Osigurajte da postoji niz za komentare
          }
          console.log('Post details:', this.post);
          console.log('Post comments:', this.post.comments);
          this.post.comments.forEach((comment) => {
            console.log(comment.text);
          });


        },
        (error) => {
          console.error('Error fetching post details:', error);
        }
      );
    }
  }

  get imageUrl(): string {
    if (this.post && this.post.imagePath) {
      console.log('Image URL:', `http://localhost:8080${this.post.imagePath}?timestamp=${new Date().getTime()}`);
      return `http://localhost:8080${this.post.imagePath}?timestamp=${new Date().getTime()}`;
    }
    return '';
  }

}
