import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/home/home.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
<<<<<<< HEAD
import { PostListComponent } from './post-list/post-list.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { UserInfoComponent } from './user-info/user-info/user-info.component';
=======
import { MyPostsComponent } from './my-posts/my-posts.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostEditComponent } from './post-details/post-edit/post-edit.component';
import { RegisteredUsersComponent } from './admin/registered-users/registered-users.component';

>>>>>>> e4dc726f7e2bffb2761cc828975473a5f3f52b0c

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'create-post', component: CreatePostComponent},
<<<<<<< HEAD
    { path: 'post-list', component: PostListComponent},
    { path: 'my-posts', component: MyPostsComponent },
    { path: 'post-details/:id', component: PostDetailsComponent },
    { path: 'user', component: UserInfoComponent },
=======
    { path: 'my-posts', component: MyPostsComponent },
    { path: 'post-details/:id', component: PostDetailsComponent },
    { path: 'post-list', component: PostListComponent},
    { path: 'post/:id/edit', component: PostEditComponent },
    { path: 'registered-users', component: RegisteredUsersComponent }
>>>>>>> e4dc726f7e2bffb2761cc828975473a5f3f52b0c
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  