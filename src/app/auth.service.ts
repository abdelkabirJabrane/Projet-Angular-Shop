import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppUser } from './model/user.model';
import { Product } from './Product';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedUserSubject: BehaviorSubject<AppUser | undefined>;
  public currentUser$: Observable<AppUser | undefined>;
  private usersUrl = 'http://localhost:3000/users';
  user: AppUser | undefined;
  private authUserKey = 'authUser'; // Key to store the authenticated user in localStorage

  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {
    const authUserString = isPlatformBrowser(platformId) ? localStorage.getItem(this.authUserKey) : null;
    const initialAuthUser = authUserString ? JSON.parse(authUserString) : undefined;
    this.authenticatedUserSubject = new BehaviorSubject<AppUser | undefined>(initialAuthUser);
    this.currentUser$ = this.authenticatedUserSubject.asObservable();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test_local_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  get authenticatedUser(): AppUser | undefined {
    return this.authenticatedUserSubject.value;
  }

  set authenticatedUser(user: AppUser | undefined) {
    this.authenticatedUserSubject.next(user);
    if (user) {
      localStorage.setItem(this.authUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.authUserKey);
    }
  }


  login(username: string, password: string): Observable<boolean> {
    return this.http.get<AppUser[]>(this.usersUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === username && u.password === password);
        if (user) {
          this.authenticatedUser = user;
          localStorage.setItem('authuser', JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }
  //******************************** */
  public authenticatuser(appuser: AppUser): Observable<boolean> {
    this.authenticatedUser = appuser;
    localStorage.setItem("authuser", JSON.stringify(appuser)); // Stocker l'utilisateur entier
    return of(true);
  }

  getUserRoles(username: string): Observable<string[]> {
    const url = `${this.usersUrl}?username=${username}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        const user = users.find(u => u.username === username);
        return user ? user.roles : []; // Récupérer les rôles de l'utilisateur ou un tableau vide s'il n'est pas trouvé
      }),
      catchError(() => of([]))
    );
  }
  getUserByEmail(email:string):Observable<AppUser>{
    const url = `${this.usersUrl}?email=${email}`;

    return this.http.get<AppUser>(url);
  }
  getCurrentUserId(): number | undefined {
    return this.authenticatedUser?.id; // Retourne l'ID de l'utilisateur actuellement authentifié ou undefined s'il n'y a pas d'utilisateur authentifié
  }

  hasRole(role: string): boolean {
    if (!this.authenticatedUser) {
      return false;
    }
    return this.authenticatedUser.roles.includes(role);
  }

  public isauthenticated() {
    return this.authenticatedUser !== undefined;
  }



  logout(): Observable<boolean> {
    this.authenticatedUser = undefined;
    localStorage.removeItem(this.authUserKey);
    return of(true);
  }




  private users: AppUser[] = [
    // Define your user objects here
  ];

  private products: Product[] = [
    // Define your product objects here
  ];


  // Méthode pour obtenir un utilisateur par ID
  getUserById(userId: string): AppUser | undefined {
    const parsedUserId = parseInt(userId, 10); // Convertir userId en nombre
    return this.users.find(u => u.id === parsedUserId);
  }


  // Méthode pour obtenir un produit par ID
  private getProductById(productId: string): any {
    return this.products.find(p => p.id === productId);
  }

  /*****************/
  private currentUserEmail: string | null = null;
  setCurrentUserEmail(email: string): void {
    this.currentUserEmail = email;
  }
  getCurrentUserEmail(): string | null {
    return this.currentUserEmail;
  }
  clearCurrentUser(): void {
    this.currentUserEmail = null;
  }
  /********** */
}
