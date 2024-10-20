import { Router } from "express";
import { OrderService } from "./order.service";

export class OrderRoutes {
  private router: Router;
  private orderService: OrderService;

  constructor() {
    this.router = Router();
    this.orderService = new OrderService();
    this.InitOrderRoutes();
  }

  private InitOrderRoutes() {
    this.router.post("/orders", this.orderService.placeOrder);

    this.router.get("/orders", this.orderService.getUserOrders);

    this.router.get("/admin/orders", this.orderService.getAllOrders);
  }

  public getRoutes() {
    return this.router;
  }
}
