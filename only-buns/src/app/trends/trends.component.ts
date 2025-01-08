import { Component, OnInit } from '@angular/core';
import { TrendsService } from './trends.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { Post } from '../model/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.css'
})
export class TrendsComponent implements OnInit {
  filter: string = '';
  totalPosts!: number;
  postsLast30Days!: number;
  top5PostsLast7Days: any[] = [];
  top10PostsAllTime: any[] = [];
  top10UsersLikesLast7Days: any[] = [];
  likesCount: number = 0;
  posts: Post[] = [];
  isLoggedIn: boolean = false;
  post: Post | null = null;

  
  constructor(private trendService: TrendsService, 
    private postService:PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {}

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.filter = params['filter'] || '';
        this.loadPosts();
      });
    }
    loadPosts() {
      switch (this.filter) {
        case 'top5':
          this.fetchTop5PostsLast7Days();
          break;
        case 'top10':
          this.fetchTop10PostsAllTime();
          break;
        case 'top10users':
          this.fetchTop10UsersLikesLast7Days();
          break;
        case 'statistics':
          this.fetchTotalPosts();
          this.fetchPostsLast30Days();
          break;
        default:
          this.fetchTotalPosts();
          this.fetchPostsLast30Days();
      }
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
       
          post.imagePath = `http://localhost:8080${post.imagePath.replace(/\\/g, '/')}?timestamp=${new Date().getTime()}`;
          //  post.imagePath = this.post ? `${this.post.imagePath}?timestamp=${new Date().getTime()}` : '';

          });
          console.log('Top 5 Posts:', this.top5PostsLast7Days);
        
      });
    }
  
    fetchTop10PostsAllTime(): void {
      this.trendService.getTop10PostsAllTime().subscribe((data: Post[]) => {
        this.top10PostsAllTime = data;
        this.top10PostsAllTime .forEach(post => {
          post.imagePath = `http://localhost:8080${post.imagePath}?timestamp=${new Date().getTime()}`;
          
        });
        console.log('Top 10 Posts All Time:', this.top10PostsAllTime);
      });
    }
  
    fetchTop10UsersLikesLast7Days(): void {
      this.trendService.getTop10UsersLikesLast7Days().subscribe((data) => {
        this.top10UsersLikesLast7Days = data;
      });
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
    } 
  }

  commentOnPost(): void {

  }

  goToProfile(creatorId: number): void {

    this.router.navigate(['/user'], { queryParams: { userId: creatorId } });
  }

  viewDetails(postId: number) {
   
      this.router.navigate(['post-details', postId], { relativeTo: this.router.routerState.root });

  }
}
