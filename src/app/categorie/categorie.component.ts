import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../Product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { AppUser } from '../model/user.model';
import { Cart } from '../cart';

@Component({
  selector: 'app-categorie',
  standalone: true,
  styleUrls: ['./categorie.component.css'], // Utilisation de styleUrls pour importer le fichier CSS
  templateUrl: './categorie.component.html',
  imports: [CommonModule, ProductDetailsComponent]
})


export class CategorieComponent implements OnInit {
  userId: number | undefined = undefined;
  public products: Product[] = [];
  selectedProducts: Product[] = [];
  myArray: Product[] = [];
  product: any;
  searchKeyword: string = '';
  originalProducts: Product[] = [];
  user: AppUser | undefined;
  email: string | null = null;

  category!: string;

  filteredProducts: Product[] = [];

  constructor(
    private ps: ProductService,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.filterByCategory(this.category);
    });

    this.email = this.userService.getUserEmail();
    if (this.email) {
      console.log("User email retrieved from localStorage:", this.email);
    } else {
      console.error('User email not available');
    }

    this.route.queryParamMap.subscribe(params => {
      const userParam = params.get('user');
      if (userParam) {
        try {
          const parsedParam = JSON.parse(userParam);

          if (Array.isArray(parsedParam)) {
            if (parsedParam.length > 0) {
              this.user = parsedParam[0] as AppUser;
            } else {
              throw new Error("User parameter is an empty array.");
            }
          } else {
            this.user = parsedParam as AppUser;
          }

          this.email = this.user.email;
          this.userService.setUserEmail(this.email);
          console.log("Parsed user object: ", this.user);
          console.log("User email: ", this.user.email);
        } catch (error) {
          console.error('Error parsing user query parameter:', error);
        }
      }
    });

    if (!this.email) {
      console.error('User email not available at ngOnInit');
    } else {
      console.log("User email retrieved:", this.email);
    }

    this.getProduct();
  }


  purchase1(product: Product): void {
    this.email = this.userService.getUserEmail();
    if (this.email) {
      this.addToCart(product);
      this.ps.purchase3(product);
    } else {
      console.error('User email not available in purchase1.');
    }
  }

  filterByCategory(category: string): void {
    this.ps.getProductsByCategory(category).subscribe(products => {
      this.products = products;
      this.filteredProducts = [...this.products];
    });
  }

  showDetails: boolean = false;


  addToCart(product: Product): void {
    if (this.email) {

      const productId = product.id.toString();
      const productName = product.name; // Ajoutez le nom du produit
      const price = product.price; // Ajoutez le prix du produit
      const image = product.img; // Ajoutez l'image du produit

      // Vérifiez si le produit existe déjà dans le panier
      if (this.isProductInCart(productId)) {
        console.log('Product is already in the cart.');
        return; // Sortez de la fonction si le produit est déjà dans le panier
      }

      // Utilisez maintenant les paramètres productName, price, et image dans l'appel à addToCart du ProductService
      this.ps.addToCart(this.email, productId, productName, price, image,1).subscribe(success => {
        if (success) {
          console.log('Product added to cart successfully.');
          // Ajoutez ici toute logique supplémentaire après l'ajout au panier
        } else {
          console.error('Error adding product to cart.');
          // Gérez les erreurs d'ajout au panier ici
        }
      });
    } else {
      console.error('User email not available.');
      // Gérez ici le cas où l'e-mail de l'utilisateur n'est pas disponible
    }
    this.showSuccess();
  }
  /******** */
  showSuccessMessage = false;

  showSuccess(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000); // Afficher le message pendant 3 secondes
  }
  /********* */


  isProductInCart(productId: string): boolean {
    // Vérifiez si le produit existe déjà dans le panier
    return this.selectedProducts.some(item => item.id === productId);
  }

  getSelectedProducts(): void {
    this.ps.getSelectedProducts();
  }

  getProduct() {
    this.ps.getAll().subscribe(data => {
      this.myArray = data;
      this.originalProducts = data;
    });
  }

  deleteProduct(id: string) {
    this.ps.delete(id).subscribe(() => {
      this.myArray = this.myArray.filter((product: { id: string; }) => product.id != id);
    });
  }

  createProduct(newProduct: Product) {
    this.ps.create(newProduct);
  }

  updateProduct(updatedProduct: Product): void {
    this.ps.update(updatedProduct);
    this.router.navigate(['/catalog/edit', updatedProduct.id]);
  }

  getById(id: string): void {
    this.ps.getById(id);
  }

  performSearch(): void {
    if (this.searchKeyword.trim() !== '') {
      this.myArray = this.myArray.filter((product: { name: string; }) =>
        product.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    } else {
      this.myArray = this.originalProducts;
    }
  }
}
