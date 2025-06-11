import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppUser } from '../model/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  userActuel: AppUser | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const formValue = this.loginForm.value;
    const username = formValue.username;
    const password = formValue.password;

    this.authService.login(username, password).subscribe(
      (success) => {
        if (success) {
          const roles = username === 'ghalimyassine3@gmail.com' ? ['ADMIN'] : ['USER'];

          const authenticatedUser: AppUser = {
            id: 1, // Simulated ID, make sure to obtain this correctly
            email: username,
            password: '', // Never store the password in plain text
            roles: roles,
            username: '' // Adjust this if you have a username field in AppUser
          };

          this.authService.authenticatuser(authenticatedUser).subscribe(() => {
            this.authService.getUserByEmail(username).subscribe(
              (u: AppUser) => {
                const serializedUser = JSON.stringify(u);
                this.router.navigate(['/catalog/product'], { queryParams: { user: serializedUser } });
              }
            );
          });

        } else {
          this.errorMessage = 'Incorrect credentials. Please try again';
        }
      },
      (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'An error occurred during the connection. Please try again.';
      }
    );
  }
  goToRegister() {
    this.router.navigate(['/register']); // Rediriger vers la composante d'inscription
  }
}
