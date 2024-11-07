import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../profile/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router ,
    private userService : UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert("Login successful!");
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authService.loggedIn = true;
  
          // Check if user id is defined and valid
          if (response.user.id !== undefined && response.user.id !== null) {
            this.userService.getUserProfile(response.user.id).subscribe(profile => {
              console.log(profile);
            });
          } else {
            console.error('User ID is not available');
          }
  
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          alert("Incorrect username or password!");
          console.error('Greška prilikom prijave', err);
        }
      });
    }
  }
  
}
