import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post.model';
import { User } from '../../profile/user.model';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

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
  selectedFile: File | null = null;
  imagePath: string | null = null;

  constructor(/*private route: ActivatedRoute, */public dialogRef: MatDialogRef<PostEditComponent>, @Inject(MAT_DIALOG_DATA) public data: { post: Post }, private postService: PostService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
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

      if (this.data && this.data.post) {
        this.post = this.data.post;
        this.imagePath = this.post?.imagePath;
        this.postForm.patchValue({
          imagePath: this.post?.imagePath,
          description: this.post?.description
        }); 
      }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onImageSelect(event: any) {
    
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0]; 
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      this.saveChanges();
    } else {
        this.postService.uploadImage(this.selectedFile).subscribe( {
          next: (result: any) => {
            this.imagePath = result.imagePath;
            this.saveChanges()
          },
          error: () => {
            alert('An error has occured uploading the photo.');
          }
        })
      }
    
  }

  saveChanges(): void {
    console.log('User:' + this.user.id);
    if (this.postForm.valid && this.post && this.user.id) {
      const updatedPost = this.postForm.value;
      //updatedPost.imagePath = this.imagePath;
      //console.log(updatedPost.imagePath)  

      if (!this.selectedFile) {
        updatedPost.imagePath = this.imagePath?.replace('http://localhost:8080', '');  // Uklanjamo localhost:8080
      } else {
        updatedPost.imagePath = this.imagePath;  // Ako je slika odabrana, koristi novu
      }
    this.postService.updatePost(this.post.id, updatedPost, this.user.id).subscribe(
      (response: Post) => {
        console.log('Post updated successfully:', response);
        this.dialogRef.close({ updatedPost: response });
      },
      (error) => console.error('Error updating post:', error)
    );
  } else {
    console.error('Post form is invalid or post/user ID is missing.');
  }
  }
  

}
