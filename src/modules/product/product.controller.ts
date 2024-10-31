import { Router } from "express";
import { ProductService } from "./product.service";
import { AuthMiddleware } from "../../middlewares/auth/authToken";

export class ProductsRoutes {
  private router: Router;
  private productService: ProductService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.router = Router();
    this.productService = new ProductService();
    this.authMiddleware = new AuthMiddleware();
    this.InitProductsRoutes();
  }

  private InitProductsRoutes() {
    this.router.post(
      "/create-products",
      this.authMiddleware.tokenVerification,
      this.productService.createProducts
    );

    this.router.get("/products", this.productService.getAllProducts);

    this.router.get("/products/:id", this.productService.getProductById);

    this.router.get("/products/search", this.productService.searchProducts);
  }

  public getRoutes() {
    return this.router;
  }
}
