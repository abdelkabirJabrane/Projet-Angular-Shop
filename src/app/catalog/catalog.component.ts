import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule,ProductDetailsComponent,RouterLink,RouterOutlet,FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = []; // Tableau de produits



  constructor(public authservice : AuthService,private router:Router,private ps :ProductService,) { }

  ngOnInit(): void {

  }



  logout(){

    this.authservice.logout().subscribe({

      next:(data)=>{

        this.router.navigateByUrl("/login");
      }

    })
  }




}



