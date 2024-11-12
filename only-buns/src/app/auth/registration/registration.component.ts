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

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    CommonModule,
  ]
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      street: ['', Validators.required],        
      city: ['', Validators.required],          
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] 
    }, { validator: this.passwordMatchValidator }); 
  }

  ngOnInit(): void {
    
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
        ? null : { mismatch: true };
  }

  onSubmit() {
    console.log(this.registrationForm);

    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Registracija uspešna', response);
          alert('Registration successful! Please check your email for the activation link.');
          this.router.navigate(['/login']); 
        },
        (error) => {
          console.error('Greška prilikom registracije', error);
          alert('An error occurred during registration. Please try again.');
        }
      );
    }
  }
}
