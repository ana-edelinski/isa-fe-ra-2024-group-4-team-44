import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/home/home.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { UserInfoComponent } from './user-info/user-info/user-info.component';
import { PostEditComponent } from './post-details/post-edit/post-edit.component';
import { RegisteredUsersComponent } from './admin/registered-users/registered-users.component';
import { TrendsComponent } from './trends/trends.component';
import { PostsOnMapComponent } from './posts-on-map/posts-on-map.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'posts', pathMatch: 'full' }, // Default prikaz
            { path: 'posts', component: PostListComponent }, // Posts list
            { path: 'my-posts', component: MyPostsComponent }, // My posts
            { path: 'post-details/:id', component: PostDetailsComponent }, // Post details
            { path: 'registered-users', component: RegisteredUsersComponent },
            { path: 'user', component: UserInfoComponent },
            { path: 'trends', component: TrendsComponent },
            { path: 'maps', component: PostsOnMapComponent },
            { path: 'analytics', component: AnalyticsComponent },

        ]
    },
    { path: 'register', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'create-post', component: CreatePostComponent},
    { path: 'post-list', component: PostListComponent},
    { path: 'my-posts', component: MyPostsComponent },
    { path: 'post-details/:id', component: PostDetailsComponent },
    { path: 'user', component: UserInfoComponent },
    { path: 'post/:id/edit', component: PostEditComponent },
    { path: 'registered-users', component: RegisteredUsersComponent },
    { path: 'analytics', component: AnalyticsComponent },
];

@NgModule({
    
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  