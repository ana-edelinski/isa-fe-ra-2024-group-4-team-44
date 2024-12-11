import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostListComponent } from '../../post-list/post-list.component';
import { MyPostsComponent } from '../../my-posts/my-posts.component';
import { UserService } from '../../profile/profile.service';
import { User } from '../../profile/user.model';
import { Subscription } from 'rxjs';

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
  ]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';
  isLoggedIn: boolean = false;
  roleId: number = 1;
  user: User = new User();
  currentView: string = 'posts';
  private userSubscription: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.isLoggedIn = this.authService.isAuthenticated();
    
  }
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated(); 
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user; 
        this.setRoleId(user.id);
      } else {
        this.router.navigate(['']);
      }
      
    });

    

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
    this.router.navigate(['/registered-users'], { state: { user: this.user }});
  }
  
}
