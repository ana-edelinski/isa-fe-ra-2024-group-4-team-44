import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../model/post.model';

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
        },
        (error) => {
          console.error('Error fetching post details:', error);
        }
      );
    }
  }

}
