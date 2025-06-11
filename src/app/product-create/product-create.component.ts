import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Product } from '../Product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [FormsModule,CommonModule,FormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})


export class ProductCreateComponent {


  newProduct: Product = new Product('', '', '', 0, 0, '','');

  constructor(private productService: ProductService,private router : Router,private fb :FormBuilder) { }

  onSubmit(): void {
    // Générer un identifiant unique à partir de la date actuelle
    const productId = new Date().getTime().toString();
    this.newProduct.id = productId;

    this.productService.create(this.newProduct).subscribe({
      next: (_data) => {
        console.log('Product created successfully!');
        this.newProduct = new Product('', '', '', 0, 0, '', '');
        this.router.navigate(['/catalog/product']); // Redirection vers la liste des produits après la mise à jour

      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }
  imagePreview: string | ArrayBuffer | null = null;


  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Obtenez le nom de fichier de l'image
      const fileName = file.name;
      console.log('File Name:', fileName);

      // Mettez à jour le champ img du produit avec le chemin relatif vers assets
      this.newProduct.img = `assets/images/${fileName}`;

      // Facultatif : affichez l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No image selected!');
    }
  }





}
