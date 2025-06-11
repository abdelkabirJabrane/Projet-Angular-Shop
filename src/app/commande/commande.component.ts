import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, Observable, throwError } from 'rxjs';
import { Cart } from '../cart';
import { UserService } from '../user.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  productId: string | null = null;
  orderDetails: any = {};
  productDetails: any = {};
  orderForm: FormGroup;
  message: string | null = null;
  quantity: number = 0;
  cartDetails: any = {};
  existingOrder: any = {};
  email: string | null = null;
  image: string | null = null;
  submittedOrder: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder,private router: Router,private userService: UserService) {
    this.orderForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expirationDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$')]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadCartDetails();
      this.loadOrderDetails();
    } else {
      console.error('No product ID found in route');
    }
    this.productId = this.route.snapshot.paramMap.get('id');
    this.initializeDetails();
  }

  initializeDetails(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state as { quantity?: number, email?: string, image?: string };
      this.quantity = state.quantity || 0;
      this.email = state.email || null;
      this.image = state.image || null;
      console.log('Quantity from navigation state:', this.quantity);
      console.log('Email from navigation state:', this.email);
      console.log('Image from navigation state:', this.image);
    } else {
      this.quantity = 0;
      this.email = null;
      this.image = null;
    }
  }


  loadCartDetails(): void {
    this.http.get<any[]>('http://localhost:3000/carts').subscribe(
      data => {
        console.log('Fetched cart data:', data);

        // Get the current user's email from UserService
        const currentUserEmail = this.userService.getUserEmail();

        // Assuming you are trying to match the cart `id`, not `productId`
        const cartItem = data.find(item => item.id === this.productId);

        if (cartItem && currentUserEmail) {
          // Filter items with the same productId and current user's email
          const itemsWithSameProductId = data.filter(item =>
            item.productId === cartItem.productId && item.email === currentUserEmail
          );

          if (itemsWithSameProductId.length > 0) {
            const totalQuantity = itemsWithSameProductId.reduce((sum, item) => sum + item.quantity, 0);
            console.log('Total quantity for productId', cartItem.productId, ':', totalQuantity);

            this.cartDetails = cartItem; // Use the found cart item
            this.image = cartItem.image;
            this.email = cartItem.email;
            this.quantity = totalQuantity;
          }
        } else {
          console.log('No cart items found for productId:', this.productId);
        }
      },
      error => {
        console.error('Error fetching cart details:', error);
      }
    );
  }





  loadOrderDetails() {
    this.http.get<any>(`http://localhost:3000/orders?productId=${this.productId}`).subscribe(
      data => {
        if (data.length > 0) {
          this.existingOrder = data[0];
          console.log('Existing order details fetched:', this.existingOrder);
        }
      },
      error => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      return;
    }

    const paymentInfo = this.orderForm.value;

    const cardNumberPattern = /^[0-9]{16}$/;
    const expirationDatePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;

    if (!cardNumberPattern.test(paymentInfo.cardNumber)) {
      alert('Le numéro de carte doit être composé de 16 chiffres.');
      return;
    }

    if (!expirationDatePattern.test(paymentInfo.expirationDate)) {
      alert('La date doit être au format dd/mm/yyyy.');
      return;
    }

    const order = {
      productId: this.productId,
      quantity: this.quantity,
      email: this.email,
      image: this.image,
      status: 'pending',
      ...paymentInfo
    };

    if (this.existingOrder.id) {
      const updatedOrder = {
        ...this.existingOrder,
        quantity: this.existingOrder.quantity + this.quantity
      };
      this.http.put(`http://localhost:3000/orders/${this.existingOrder.id}`, updatedOrder).subscribe(() => {
        this.message = 'Commande mise à jour avec succès!';
        this.submittedOrder = paymentInfo;
      });
    } else {
      this.http.post('http://localhost:3000/orders', order).subscribe(() => {
        this.message = 'Commande validée avec succès!';
        this.submittedOrder = paymentInfo;
      });
    }
  }

  private apiUrl = 'http://localhost:3000/orders'; // API URL for orders

  updateOrder(orderId: string, updatedOrder: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${orderId}`, updatedOrder).pipe(
      catchError(error => {
        console.error('Error updating order:', error);
        return throwError(() => new Error('Error updating order'));
      })
    );
  }
}
