import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';
import { Cart } from '../cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})


export class ProductDetailsComponent {

  products: Product[]=[];

  constructor( private ps : ProductService, public auth:AuthService,private router :Router) { }


  selectedProducts: Product[] = [];
  @Output()  ed : EventEmitter<Product> =new EventEmitter<Product>();
  @Output() searchAction: EventEmitter<void> = new EventEmitter<void>();
  @Output()  cr : EventEmitter<Product> =new EventEmitter<Product>();
  @Output() del : EventEmitter<Product> =new EventEmitter<Product>();
  @Output() c : EventEmitter<Product> =new EventEmitter<Product>();
  @Input() product!: Product ;
  @Input() keyword!: string ;
  @Output() ach =new EventEmitter();

  ngOnInit(): void {



  }

  purchase2(product:Product) {

    return this.ach.emit(product);

  }



  showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  onDeleteProduct(id: string) {
    this.del.emit(); // Émet l'identifiant du produit à supprimer
  }

  onCreate(product:Product){
    return this.cr.emit(product);
  }

  onUpdate(product:Product){
    return this.ed.emit(product);

  }

  onSearch(): void {
    // Emit the search action event
    this.searchAction.emit();
  }

  showSuccessMessage = false;

  showSuccess(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000); // Afficher le message pendant 3 secondes
  }


  togglePromotion(): void {
    if (this.product) {
      const newPromotionState = !this.product.onPromotion;
      this.ps.updateProductPromotion(this.product.id, newPromotionState).subscribe(updatedProduct => {
        this.product.onPromotion = newPromotionState; // Seulement mettre à jour l'état de promotion
      });
    }
  }
}
