import { Injectable, OnInit } from '@angular/core';
import { Product } from './Product';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of,Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Cart } from './cart';
import { AuthService } from './auth.service';
import { v4 as uuidv4Alias } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = 'http://localhost:3000/products'; // API URL for products

  alertmessage$: any;
  forEach(arg0: (product: { message: string; }) => void) {
    throw new Error('Method not implemented.');
  }



  constructor( private router : Router,private http : HttpClient, private auth :AuthService) {
  }


  products: Product[] = []; // Tableau de produits
  private Q :number=0;
  private selectedProducts: Product[] = [];

  private cartItemsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public cartItems$: Observable<Product[]> = this.cartItemsSubject.asObservable();




  isLowQuantity(quantity: number): boolean {
    return quantity < 5;
  }

  purchase3(product: Product): void {
    if (product.quantity > 0) {
      // Décrémenter la quantité
      --product.quantity;

      // Mettre à jour la quantité dans la base de données
      this.updateProductQuantity(product.id, product.quantity).subscribe(
        updatedProduct => {
          console.log('Product quantity updated successfully in the database.');
          if (updatedProduct.quantity < 5) {
            updatedProduct._alertMessage = `⚠︎ Quantité restante inférieure à 5 !`;
          }
        },
        error => {
          console.error('Error updating product quantity:', error);
          // Afficher un message d'erreur ou gérer l'erreur d'une autre manière
        }
      );
    } else {
      product._alertMessage = `Produit épuisé !`;
    }
  }


  updateProductQuantity(productId: string, newQuantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}`, { quantity: newQuantity });
  }



  getSelectedProducts(): Observable<Product[]> {
    return this.cartItemsSubject.asObservable();
  }
  /*************************** */
  private cartsUrl = 'http://localhost:3000/carts'; // URL de votre backend (par exemple, une API REST)


  /**************************************** */
  //get
  getAll(page: number=1,size: number=8) {
    return this.http.get<Product[]>(`${this.apiUrl}?_page=${page}&_limit=${size}`);
  }
  //delete
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  //create
  create(product: Product): Observable<any> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }


  private addedProductsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  addedProducts$ = this.addedProductsSubject.asObservable();

  //edit
  update(product: Product): Observable<any> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product)
  }


  getById(id: string): Observable<Product> {
    console.log("1");
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const url = `${this.apiUrl}?category=${category}`;
    return this.http.get<Product[]>(url);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const url = `${this.apiUrl}?name_like=${keyword}`;
    return this.http.get<Product[]>(url);
  }



  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartsUrl);
  }
  addToCart(email: string, productId: string, productName: string, price: number, image: string, quantity: number): Observable<boolean> {
    const cartItem: Cart = {
      id: uuidv4Alias(),  // Generate a unique ID for the new cart item
      email,
      productId,
      quantity,
      productName,
      price,
      image,
    };

    return this.http.post<any>(this.cartsUrl, cartItem).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error adding cart item:', error);
        return throwError(() => new Error('Error adding cart item'));
      })
    );
  }

  generateCartItemId(): string {
    return uuidv4Alias();
  }

  updateCartQuantity(cartItemId: string, newQuantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.cartsUrl}/${cartItemId}`, { quantity: newQuantity });
  }

  getCartsByEmail(email: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.cartsUrl}?email=${email}`);
  }





  updateProductPromotion(productId: string, onPromotion: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}`, { onPromotion });
  }

  removeFromCart(cartItemId: string): Observable<void> {
    const url = `${this.cartsUrl}/${cartItemId}`;
    console.log(`Removing cart item with URL: ${url}`); // Debug log

    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.error('Error removing cart item:', error);
        return throwError(() => new Error('Error removing cart item'));
      })
    );
  }
}



