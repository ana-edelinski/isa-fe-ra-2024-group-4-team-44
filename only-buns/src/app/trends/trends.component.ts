import { Component, OnInit } from '@angular/core';
import { TrendsService } from './trends.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { Post } from '../model/post.model';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.css'
})
export class TrendsComponent implements OnInit {
  totalPosts!: number;
  postsLast30Days!: number;
  top5PostsLast7Days: any[] = [];
  top10PostsAllTime: any[] = [];
  top10UsersLikesLast7Days: any[] = [];
  likesCount: number = 0;
  posts: Post[] = [];

    // Pratimo da li je sekcija otvorena
  sectionsState: { [key: string]: boolean } = {
      top5Posts: false,
      top10Posts: false,
      top10UsersLikes: false
  };
  
  constructor(private trendService: TrendsService, private postService:PostService) {}
    ngOnInit(): void {
      this.fetchTotalPosts();
      this.fetchPostsLast30Days();
      this.fetchTop5PostsLast7Days();
      this.fetchTop10PostsAllTime();
      this.fetchTop10UsersLikesLast7Days();
    }
  
    fetchTotalPosts(): void {
      this.trendService.getTotalPosts().subscribe((data) => {
        this.totalPosts = data;
      });
    }
  
    fetchPostsLast30Days(): void {
      this.trendService.getPostsLast30Days().subscribe((data) => {
        this.postsLast30Days = data;
      });
    }
  
    fetchTop5PostsLast7Days(): void {
      this.trendService.getTop5PostsLast7Days().subscribe((data: Post[]) => {
        this.top5PostsLast7Days = data;
        this.top5PostsLast7Days.forEach(post => {
          post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
          //this.loadLikesCount(post.id);
        });
      });
    }
  
    fetchTop10PostsAllTime(): void {
      this.trendService.getTop10PostsAllTime().subscribe((data: Post[]) => {
        this.top10PostsAllTime = data;
        this.top10PostsAllTime .forEach(post => {
          post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
          //this.loadLikesCount(post.id);
        });
      });
    }
  
    fetchTop10UsersLikesLast7Days(): void {
      this.trendService.getTop10UsersLikesLast7Days().subscribe((data) => {
        this.top10UsersLikesLast7Days = data;
      });
    }

    toggleSection(section: string) {
      this.sectionsState[section] = !this.sectionsState[section];
    }
  
    isSectionOpen(section: string): boolean {
      return this.sectionsState[section];
    }
    
    // loadLikesCount(postId: number): void {
    //     this.postService.getLikesCount(postId).subscribe(
    //       (count) => this.likesCount = count,
    //       (error) => console.error('Error fetching likes count:', error)
    //     );
    //   }
    
      getImageUrl(post: Post): string {
        return `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
      }

}
