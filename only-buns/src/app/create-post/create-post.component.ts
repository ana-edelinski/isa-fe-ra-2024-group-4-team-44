import { Component } from '@angular/core';
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
export class CreatePostComponent {

  constructor(private postService: PostService) {} 

  fb = new FormBuilder()
  selectedFile: File | null = null;
  imagePath: string | null = null;
  newPost: Post | null = null;

  postForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    address: this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required]
    })
  });

  onImageSelect(event: any){
    const file:File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        this.imagePath = reader.result as string;
        this.postForm.patchValue({
          image: this.imagePath
        });
    };
    reader.readAsDataURL(file); 
}



  

  onPostSubmit() {
    if (this.postForm.valid) {
      console.log(this.postForm.value);
      
    } else {
      console.log('Form is invalid');
    }
  }

}
