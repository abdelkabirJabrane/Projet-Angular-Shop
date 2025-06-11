export interface Cart {
  id: string; // Ajouter la propriété pour l'ID du panier
  email: string;
  productId: string;
  quantity: number;
  productName: string;
  price: number;
  image: string;
}
