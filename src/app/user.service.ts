import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppUser } from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:3000/users'; // URL de votre backend (par exemple, une API REST)

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.usersUrl);
  }

  register(user: AppUser): Observable<boolean> {
    return this.getUsers().pipe(
      switchMap(users => {
        const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), -1);
        user.id = maxId + 1; // Incrémenter l'ID
        return this.http.post<any>(this.usersUrl, user).pipe(
          map(() => true), // Retourner true si l'ajout est réussi
          catchError(() => {
            console.error('Error adding user');
            return of(false); // Retourner false en cas d'erreur lors de l'ajout
          })
        );
      }),
      catchError(() => throwError(new Error('Registration failed')))
    );
  }

  private userEmailKey = 'userEmail'; // Clé pour stocker l'email dans localStorage

  setUserEmail(email: string | null): void {
    if (email) {
      localStorage.setItem(this.userEmailKey, email);
    } else {
      localStorage.removeItem(this.userEmailKey);
    }
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.userEmailKey);
  }

  clearUserEmail(): void {
    localStorage.removeItem(this.userEmailKey);
  }
}
