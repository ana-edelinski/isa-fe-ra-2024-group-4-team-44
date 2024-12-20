import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../profile/profile.service';
import { User } from '../../profile/user.model';
import { Subscription } from 'rxjs';
import { TrendsComponent } from '../../trends/trends.component';
import { PostListComponent } from '../../post-list/post-list.component';
import { MyPostsComponent } from '../../my-posts/my-posts.component';
import { ProfileComponent } from '../../profile/profile.component';
import { PostsOnMapComponent } from '../../posts-on-map/posts-on-map.component';

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
    MyPostsComponent,
    TrendsComponent,
    ProfileComponent,
    PostsOnMapComponent
    
  ]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';
  isLoggedIn: boolean = false;
  roleId: number = 1;
  user: User = new User();
  currentView: string = 'posts';
  private userSubscription: Subscription = Subscription.EMPTY;
  isBrowse =false;
  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.isLoggedIn = this.authService.isAuthenticated();
    
  }
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isBrowse = typeof window !== 'undefined'; 
    if (this.isBrowse=typeof window !== 'undefined') {
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user; 
        this.setRoleId(user.id);
      } else {
        this.router.navigate(['']);
      }
      
    });

  }

  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async setRoleId(userId: number): Promise<void> {
    try {
      this.roleId = await this.userService.getRole(userId);  
      console.log("Role ID set to: ", this.roleId);
    } catch (error) {
      this.roleId = -1;
      console.error("Error while setting role ID:", error);
    }
  }

 

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
  profile() {
    this.router.navigate(['/profile'], { state: { user: this.user } });
  }

  isPostsTabActive(): boolean {
    const allowedRoutes = ['/posts', '/my-posts', '/trends', '/maps'];
    return allowedRoutes.some(route => this.router.url.includes(route));
  }  

  createPost() {
    this.router.navigate(['/create-post'], { state: { user: this.user } });
  }

  isHomePage(): boolean {
    return true; 
  }

  myPosts() {
    this.router.navigate(['my-posts'], { relativeTo: this.router.routerState.root });
  }
  
  showPosts() {
    this.router.navigate(['posts'], { relativeTo: this.router.routerState.root });
  }
  
  registeredUsers() {
    this.router.navigate(['registered-users'], { relativeTo: this.router.routerState.root });
  }

  trends()
  {
    this.router.navigate(['trends'], { relativeTo: this.router.routerState.root });
  }

  // maps()
  // {
  //   this.router.navigate(['maps'], { relativeTo: this.router.routerState.root });
  // }
  maps() {
    if (this.isLoggedIn && this.roleId === 1 && this.isBrowse) {
      this.router.navigate(['maps'], { relativeTo: this.router.routerState.root });
    } else {
      console.warn('Access to maps is restricted.');
    }
  }
  
  
}
