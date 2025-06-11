import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';
import { Cart } from '../cart';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carts: Cart[] = [];
  groupedCarts: Cart[] = [];
  userEmail: string | null = null;
  quantityToAdd: number = 1;


  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private os:OrderService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.userService.getUserEmail();
    if (this.userEmail) {
      this.getCartsForCurrentUser();
    } else {
      console.error('User email not available in CartComponent');
    }
  }

  addToCart(product: Product): void {
    if (!this.userEmail) {
      console.error('User email not available.');
      return;
    }

    const cartItemId = this.productService.generateCartItemId();

    this.productService.addToCart(
      this.userEmail,
      cartItemId,
      product.name,
      product.price,
      product.img,
      this.quantityToAdd
    ).subscribe(success => {
      if (success) {
        console.log('Product added to cart successfully.');
        this.getCartsForCurrentUser();
      } else {
        console.error('Error adding product to cart.');
      }
    });
  }

  getCartsForCurrentUser(): void {
    if (this.userEmail) {
      this.productService.getCartsByEmail(this.userEmail).subscribe(carts => {
        this.carts = carts;
        this.groupedCarts = this.groupCartItems(carts);
        this.os.setGroupedQuantity(this.groupedCarts); // Stocker la quantité groupée dans le service

      }, error => {
        console.error('Error getting carts:', error);
      });
    }
  }

  groupCartItems(carts: Cart[]): Cart[] {
    const cartMap = new Map<string, Cart>();
    carts.forEach(cartItem => {
      if (cartMap.has(cartItem.productId)) {
        cartMap.get(cartItem.productId)!.quantity += cartItem.quantity;
      } else {
        cartMap.set(cartItem.productId, { ...cartItem });
      }
    });
    return Array.from(cartMap.values());
  }

  findCartItemByProductId(productId: string): Cart | undefined {
    return this.carts.find(cartItem => cartItem.productId === productId);
  }

  updateCart(cartItem: Cart): void {
    this.productService.updateCartQuantity(cartItem.id, cartItem.quantity).subscribe(
      () => {
        console.log('Cart item quantity updated successfully.');
        this.getCartsForCurrentUser();
      },
      error => {
        console.error('Error updating cart item quantity:', error);
      }
    );
  }

  removeFromCart(cartItemId: string): void {
    if (!cartItemId) {
      console.error('Cart item ID is not available.');
      return;
    }

    this.productService.removeFromCart(cartItemId).subscribe(
      () => {
        console.log('Cart item removed successfully.');
        this.getCartsForCurrentUser();
      },
      error => {
        console.error('Error removing cart item:', error);
      }
    );
  }


  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.groupedCarts.forEach(cartItem => {
      totalPrice += cartItem.price * cartItem.quantity;
    });
    return totalPrice;
  }

  passerCommande(product: any): void {
    // Redirection vers le composant Commande avec l'ID du produit et la quantité
    this.router.navigate(['/catalog/commande', product.id], { state: { quantity: product.quantity } });
  }


  voirStatus(product: any) {
    // Redirection vers une page où l'utilisateur peut voir le statut de sa commande
    this.router.navigate(['/status', product.id]);
  }
}
