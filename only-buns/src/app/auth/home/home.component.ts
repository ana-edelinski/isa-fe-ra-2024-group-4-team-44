import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostListComponent } from '../../post-list/post-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,  MatIconModule,  MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    PostListComponent,
  ]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated(); 
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
  profile() {
    this.router.navigate(['/profile'], { state: { user: this.authService.getUser() } });
  }

  createPost() {
    this.router.navigate(['/create-post'], { state: { user: this.authService.getUser() } });
  }

  isHomePage(): boolean {
    return true; 
  }

  myPosts() {
    this.router.navigate(['/my-posts'], { state: { user: this.authService.getUser() }});
  }
  
}
