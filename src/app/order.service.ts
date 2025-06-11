import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/carts'; //

  constructor(private http: HttpClient) {}


  private groupedQuantity: any[] = [];

  setGroupedQuantity(quantity: any[]): void {
    this.groupedQuantity = quantity;
  }

  getGroupedQuantity(): any[] {
    return this.groupedQuantity;
  }

  getGroupedCartItemsByUser(userEmail: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}?email=${userEmail}`);
  }
}
