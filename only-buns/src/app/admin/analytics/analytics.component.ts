import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent {
  weeklyPosts = 120;
  weeklyComments = 450;
  monthlyPosts = 500;
  monthlyComments = 1800;
  yearlyPosts = 6000;
  yearlyComments = 22000;

  userAnalyticsData = [
    { name: 'Created Posts', value: 40 },
    { name: 'Only Comments', value: 35 },
    { name: 'No Activity', value: 25 },
  ];
}
