import { Router } from "express";
import { OrderService } from "./order.service";
import { AuthMiddleware } from "../../middlewares/auth/authToken";

export class OrderRoutes {
  private router: Router;
  private orderService: OrderService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.orderService = new OrderService();
    this.authMiddleware = new AuthMiddleware();
    this.InitOrderRoutes();
  }

  private InitOrderRoutes() {
    this.router.post(
      "/orders",
      this.authMiddleware.tokenVerification,
      this.orderService.placeOrder
    );
    
    this.router.post(
      "/make-payment",
      this.authMiddleware.tokenVerification,
      this.orderService.makePayment
    );

    this.router.get(
      "/get-orders",
      this.authMiddleware.tokenVerification,
      this.orderService.getUserOrders
    );

    this.router.get(
      "/admin/orders",
      this.authMiddleware.tokenVerification,
      this.orderService.getAllOrders
    );
    this.router.delete("/api/v1/orders/:id", this.orderService.deleteOrder);
  }

  public getRoutes() {
    return this.router;
  }
}
