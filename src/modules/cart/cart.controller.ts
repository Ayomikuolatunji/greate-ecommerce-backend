import { Router } from "express";
import { CartService } from "./cart.service";
import { AuthMiddleware } from "../../middlewares/auth/authToken";

export class CartRoutes {
  private router: Router;
  private cartService: CartService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.cartService = new CartService();
    this.authMiddleware = new AuthMiddleware();
    this.InitCartRoutes();
  }

  private InitCartRoutes() {
    this.router.post("/cart", this.authMiddleware.tokenVerification, this.cartService.addToCart);
    this.router.get("/cart", this.authMiddleware.tokenVerification, this.cartService.getUserCart);
    this.router.delete(
      "/cart/item/:itemId",
      this.authMiddleware.tokenVerification,
      this.cartService.deleteCartItem
    );
    this.router.post(
      "/cart/item/:productId",
      this.authMiddleware.tokenVerification,
      this.cartService.deleteProductFromCart
    );
  }

  public getRoutes() {
    return this.router;
  }
}
