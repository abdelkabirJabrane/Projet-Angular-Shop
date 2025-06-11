
export class Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  img: string;

  _alertMessage?: string;
  category: string;

  onPromotion?: boolean; // Nouvelle propriété pour indiquer la promotion


  constructor(id: string, name: string, description: string, quantity: number, price: number, img: string, category: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
    this.img = img;
    this.category = category;
  }


  getCategory(): string {
    return this.category;
  }
  setCategory(category: string): void {
    this.category = category;
  }

  getImg(): string {
    return this.img;
  }
  setImg(img: string): void {
    this.img = img;
  }


  getId(): string {
    return this.id;
  }
  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }
  setDescription(description: string): void {
    this.description = description;
  }

  getQuantity(): number {
    return this.quantity;
  }
  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getPrice(): number {
    return this.price;
  }
  setPrice(price: number): void {
    this.price = price;
  }

  getAlertMessage(): any {
    return this._alertMessage;
  }
  setAlertMessage(alertMessage: any): void {
    this._alertMessage = alertMessage;
  }
}
