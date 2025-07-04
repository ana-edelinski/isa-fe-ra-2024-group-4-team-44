import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  weeklyPosts = 0;
  weeklyComments = 0;
  monthlyPosts = 0;
  monthlyComments = 0;
  yearlyPosts = 0;
  yearlyComments = 0;

  userAnalyticsData = [
    { name: 'Created Posts', value: 0 },
    { name: 'Only Comments', value: 0 },
    { name: 'No Activity', value: 0 },
  ];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadPostCounts();
    this.loadCommentCounts();
    this.loadUserEngagementStatistics();
  }

  loadPostCounts() {
    this.analyticsService.getPostCounts().subscribe(
      (data) => {
        console.log('Post counts data:', data);
        this.weeklyPosts = data['weekly_posts'];
        this.monthlyPosts = data['monthly_posts'];
        this.yearlyPosts = data['yearly_posts'];
      },
      (error) => {
        console.error('Error fetching post counts:', error);
      }
    );
  }

  loadCommentCounts() {
    this.analyticsService.getCommentCounts().subscribe(
      (data) => {
        console.log('Comment counts data:', data); 
        this.weeklyComments = data['weekly_comments'];
        this.monthlyComments = data['monthly_comments'];
        this.yearlyComments = data['yearly_comments'];
      },
      (error) => {
        console.error('Error fetching comment counts:', error);
      }
    );
  }

  loadUserEngagementStatistics() {
    this.analyticsService.getUserEngagementStatistics().subscribe(
      (data) => {
        console.log('User engagement data:', data); 
        this.userAnalyticsData = [
          { name: 'Created Posts', value: data['users_with_posts'] },
          { name: 'Comments Only', value: data['users_with_only_comments'] },
          { name: 'Inactive', value: data['inactive_users'] },
        ];
      },
      (error) => {
        console.error('Error fetching user engagement statistics:', error);
      }
    );
  }
  
}
