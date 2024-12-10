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
import { Subscription } from 'rxjs';
import { User } from '../../profile/user.model';
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
  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;
  loggedInUserId: number  | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: ( result ) => {
          this.isLoading = false;
          this.authService.loggedIn = true;
          this.user.id = result.userId
          console.log(this.user.id);
          let date = new Date();
          console.log(date);
          this.userService.changeLastActivity(this.user.id, date).subscribe({
            
          })
          this.router.navigate(['/']);
        },
        error: ( ) => {
          this.isLoading = false;
          alert("Neispravan username ili lozinka!");
        }
      });
    }
  }
}
