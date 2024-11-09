import { Component , OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { Router } from '@angular/router';
import { Post } from '../model/post.model';
import { PostService } from '../post.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../profile/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatIconModule, 
    FormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,], 
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit, OnDestroy {

  constructor(private postService: PostService, private authService: AuthService, private router: Router) {} 

  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;


  fb = new FormBuilder()
  selectedFile: File | null = null;
  imagePath: string | null = null;

  postForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    address: this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required]
    })
  });

  ngOnInit(): void {
    this.resetImagePath();
    this.postForm.reset()
    this.userSubscription = this.authService.getUser().subscribe(user => {
      if (user && user.id) {
        this.user = user; 
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


  resetImagePath() {
    this.imagePath = null;
    this.selectedFile = null;
    this.postForm.patchValue({
      image: null 
    });
    
  }

  

  onImageSelect(event: any) {
    
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0]; 
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert("A photo is needed.")
      return;
    }  

    this.postService.uploadImage(this.selectedFile).subscribe( {
      next: (result: any) => {
        console.log(result);
        this.imagePath = result.imagePath;
        this.onPostSubmit()
      },
      error: () => {
        alert('An error has occured uploading the photo.');
      }
    })
  }


  onPostSubmit() {
    if (this.postForm.valid) {
      console.log(this.imagePath)
      if(this.imagePath !== null && this.user.id != null){
        const newPost: Post = {
          id: 100,
          creatorId: this.user.id,
          creatorUsername: '',
          description: this.postForm.value.description || '',
          creationTime: new Date(),
          imagePath: this.imagePath, // Dodeljujemo putanju koju smo dobili sa servera
          locationStreet: this.postForm.value.address?.street || '',
          locationCity: this.postForm.value.address?.city || '',
          locationPostalCode: this.postForm.value.address?.postalCode || '',
          comments: [],
          likes: []
        };

        this.postService.createPost(newPost).subscribe({
          next: (result: Post) => {
            if (result) {
              this.resetImagePath()
              console.log('Post created successfully');
              this.router.navigate([''], { state: { user: this.user }});
            } else {
              alert('An error has occurred. Please try again.');
            }
          },
          error: () => {
            alert('An error has occurred. Please try again.');
          }
        });
      } else {
        console.log("Error uploading photo")
      }   
    } else {
      console.log("Form not valid")
    }
  }

}



  

 