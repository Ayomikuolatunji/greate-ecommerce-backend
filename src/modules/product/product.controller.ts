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
    const upload = this.productService.getMulter().fields([
      { name: "salesCoverPicture", maxCount: 1 },
      { name: "subImages", maxCount: 10 },
    ]);

    this.router.post(
      "/create-products",
      this.authMiddleware.tokenVerification,
      upload,
      this.productService.createProducts
    );

    this.router.put(
      "/edit-products/:id",
      this.authMiddleware.tokenVerification,
      upload,
      this.productService.editProduct
    );

    this.router.get("/products", this.productService.getAllProducts);

    this.router.get("/products/:id", this.productService.getProductById);

    this.router.get("/search-query", this.productService.searchProducts);

    this.router.delete(
      "/delete-products/:id",
      this.authMiddleware.tokenVerification,
      this.productService.deleteProduct
    );
  }

  public getRoutes() {
    return this.router;
  }
}
