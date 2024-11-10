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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'create-post', component: CreatePostComponent},
    { path: 'post-list', component: PostListComponent},
    { path: 'my-posts', component: MyPostsComponent },
    { path: 'post-details/:id', component: PostDetailsComponent }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  