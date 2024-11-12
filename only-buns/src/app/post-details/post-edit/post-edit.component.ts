import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../post.service';
import { Post } from '../../model/post.model';
import { User } from '../../profile/user.model';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [FormsModule,
            ReactiveFormsModule,
            CommonModule,
            MatCardModule,
            MatFormFieldModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  postForm: FormGroup;

  constructor(private route: ActivatedRoute, private postService: PostService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.postForm = this.fb.group({
      imagePath: ['', Validators.required],  
      description: ['', Validators.required]  
    });
  }
  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user; 
      } else {
        this.router.navigate(['/login']);
      }
    });
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      const id = +postId;
      this.postService.getPostById(id).subscribe(
        (data: Post) => {
          this.post = data;
          this.postForm.patchValue({
            imagePath: this.post?.imagePath,
            description: this.post?.description
          });  
        },
        (error) => console.error('Error fetching post for edit:', error)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  saveChanges(): void {
    console.log('User:' + this.user.id);
    if (this.postForm.valid && this.post && this.user.id) {
      const updatedPost = this.postForm.value;
      this.postService
        .updatePost(this.post.id, updatedPost, this.user.id)
        .subscribe(
          (response) => {
            console.log('Post updated successfully:', response);
            this.router.navigate(['/post-details', this.post?.id]); 
          },
          (error) => console.error('Error updating post:', error)
        );
    } else {
      console.error('Post form is invalid or post/user ID is missing.');
    }
  }
  

}
