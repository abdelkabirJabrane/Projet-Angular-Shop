import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router'; // Importez le service Router
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { FormsModule } from '@angular/forms'; // Assurez-vous que ce module est importé dans votre module Angular

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone:true,
  imports:[CommonModule,FormsModule]
})

export class RegisterComponent {
  constructor(private userService: UserService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { username, email, password, role } = form.value;
      const normalizedRole = role ? role.toUpperCase() :'USER'; // Vérifiez si role est défini avant d'appeler toUpperCase
      if (normalizedRole !== null && (normalizedRole !== 'ADMIN' && normalizedRole !== 'USER')) {
        console.error('Invalid role:', normalizedRole);
        return;
      }
      const newUser = {
        id: 0,
        username,// L'ID sera généré par la base de données, donc 0 pour le moment
        email,
        password,
        roles: [normalizedRole] // Utilisez la valeur du rôle normalisée
      };
      this.userService.register(newUser).subscribe(
        () => {
          console.log('Registration successful');
          // Rediriger vers la page de connexion après une inscription réussie
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration error:', error.message);
          // Afficher un message d'erreur à l'utilisateur ou gérer l'erreur autrement
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

}
