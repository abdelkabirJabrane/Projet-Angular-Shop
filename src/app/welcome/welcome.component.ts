import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']); // Rediriger vers la composante d'inscription
  }

  goToLogin() {
    this.router.navigate(['/login']); // Rediriger vers la composante de connexion
  }
}
