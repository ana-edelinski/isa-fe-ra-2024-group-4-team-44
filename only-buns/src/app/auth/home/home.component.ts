import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class HomeComponent {
  title: string = 'OnlyBuns!';

  isHomePage(): boolean {
    return true; // Možete dodati logiku da proverite da li ste na home page
  }
}
