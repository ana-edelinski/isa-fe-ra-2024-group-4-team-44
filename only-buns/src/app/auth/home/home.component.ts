import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { LocationMessage } from '../../model/location-message.model';
import { ChatsComponent } from '../../chats/chats.component';
import { MapsService } from '../../posts-on-map/maps.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../../create-post/create-post.component';

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
    PostsOnMapComponent,
    ChatsComponent
    
  ]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';
  isLoggedIn: boolean = false;
  roleId: number = 1;
  user: User = new User();
  currentView: string = 'posts';
  newMessagesCount: number = 0;
  private userSubscription: Subscription = Subscription.EMPTY;
  private messagesSubscription: Subscription = Subscription.EMPTY;
  @ViewChild(PostListComponent) postListComp!: PostListComponent;

  isBrowse =false;
  constructor(private authService: AuthService, 
    private router: Router,
    private userService: UserService,
    private mapsService:  MapsService,
    private dialog: MatDialog) {
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
        this.loadNewMessages();
        setInterval(() => this.loadNewMessages(), 60000); 
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

  chats() {

    this.newMessagesCount = 0;
    this.router.navigate(['/chats']);
  }

  loadNewMessages() {
    this.mapsService.getAllLocationMessages().subscribe((messages: LocationMessage[]) => {
      this.newMessagesCount = messages.filter(message => !message.isRead).length;
    });
  }


  isPostsTabActive(): boolean {
    const allowedRoutes = ['/posts', '/my-posts', '/trends', '/maps'];
    return allowedRoutes.some(route => this.router.url.includes(route));
  }  

  createPost() {
    this.router.navigate(['/create-post'], { state: { user: this.user } });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '80%', 
      maxWidth: 'none',
      height: '90%',
    });
  
    dialogRef.afterClosed().subscribe(newPost => {
      if (newPost) {
        this.postListComp.posts.push(newPost);
      }
      
    });
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
  
  isTrendsActive(): boolean {
    return this.router.url.includes('/trends');
  }
  loadTop5Posts() {
    this.router.navigate(['/trends'], { queryParams: { filter: 'top5' } });
  }
  
  loadTop10Posts() {
    this.router.navigate(['/trends'], { queryParams: { filter: 'top10' } });
  }
  
  loadPostStatistics() {
    this.router.navigate(['/trends'], { queryParams: { filter: 'statistics' } });
  }

  loadTop10Users() {
    this.router.navigate(['/trends'], { queryParams: { filter: 'top10users' } });
  }
  
  analytics() {
    this.router.navigate(['analytics'], { relativeTo: this.router.routerState.root });
  }

  userChats() {
    this.router.navigate(['/user-chat']);
  }
  
}
