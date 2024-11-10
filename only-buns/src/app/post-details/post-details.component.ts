import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {
  //post$: Observable<Post> | null = null;
  post: Post | null = null;
  imageUrl: string = '';
  likesCount: number = 0;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
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

  getImageUrl(post: Post): string {
    return `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
  }

  loadLikesCount(postId: number): void {
    this.postService.getLikesCount(postId).subscribe(
      (count) => this.likesCount = count,
      (error) => console.error('Error fetching likes count:', error)
    );
  }

}
