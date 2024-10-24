import { Router } from "express";
import { ProductService } from "./product.service";

export class ProductsRoutes {
  private router: Router;
  private productService: ProductService;

  constructor() {
    this.router = Router();
    this.productService = new ProductService();
    this.InitProductsRoutes();
  }

  private InitProductsRoutes() {
    // Admin route to create a new product
    this.router.post("/create-products", this.productService.createProducts);

    // User route to get all products
    this.router.get("/products", this.productService.getAllProducts);

    // User route to get a single product by ID
    this.router.get("/products/:id", this.productService.getProductById);
  }

  public getRoutes() {
    return this.router;
  }
}
