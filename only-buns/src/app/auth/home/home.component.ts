import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated(); 
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  isHomePage(): boolean {
    return true; 
  }
}
