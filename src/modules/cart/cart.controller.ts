import { Router } from "express";
import { CartService } from "./cart.service";

export class CartRoutes {
  private router: Router;
  private cartService: CartService;

  constructor() {
    this.router = Router();
    this.cartService = new CartService();
    this.InitCartRoutes();
  }

  private InitCartRoutes() {
    this.router.post("/cart", this.cartService.addToCart);

    this.router.get("/cart", this.cartService.getUserCart);
  }

  public getRoutes() {
    return this.router;
  }
}
