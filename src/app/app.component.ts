import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CatalogComponent} from './catalog/catalog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CartComponent } from './cart/cart.component';
import { CommandeComponent } from './commande/commande.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CartComponent,
    RouterOutlet,
    WelcomeComponent,
    CatalogComponent,
    FormsModule,
    CommonModule,
    LoginComponent,
    HttpClientModule,
    RegisterComponent,
    CommandeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent {
  title = 'test1';
}
