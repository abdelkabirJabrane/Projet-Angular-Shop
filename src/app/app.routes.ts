import { DefaultTitleStrategy, RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { CatalogComponent } from './catalog/catalog.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ProductCreateComponent } from './product-create/product-create.component';
import { EditComponent } from './edit/edit.component';
import { CategorieComponent } from './categorie/categorie.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CommandeComponent } from './commande/commande.component';

export const routes: Routes = [


  { path: 'catalog', component: CatalogComponent ,canActivate:[AuthenticationGuard], children : [

      { path: 'Accueil', component: AccueilComponent},
      { path: 'product', component: ProductListComponent },
      {path: 'cart', component: CartComponent},
      { path: 'create-product', component: ProductCreateComponent },
      { path: 'commande/:id', component: CommandeComponent },
      {path: 'edit/:id', component: EditComponent},
      { path: 'categorie/:category', component: CategorieComponent }
    ]},

  {path: 'welcome', component: WelcomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: "", component: WelcomeComponent }
];
