import { Router } from "express";
import { OverviewService } from "./overview.service";
import { AuthMiddleware } from "../../middlewares/auth/authToken";
import { adminPermission } from "../../middlewares/permission/permission";

export class OverviewRoutes {
  private router: Router;
  private overviewService: OverviewService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.router = Router();
    this.overviewService = new OverviewService();
    this.authMiddleware = new AuthMiddleware();
    this.initOverviewRoutes();
  }
  private initOverviewRoutes() {
    this.router.get(
      "/overview/stats",
      this.authMiddleware.tokenVerification,
      adminPermission,
      this.overviewService.getOverviewStats
    );
    this.router.get(
      "/admin/orders",
      this.authMiddleware.tokenVerification,
      adminPermission,
      this.overviewService.fetchOrders
    );
    this.router.get(
      "/admin/transactions",
      this.authMiddleware.tokenVerification,
      adminPermission,
      this.overviewService.fetchTransactions
    );
    this.router.get(
      "/users",
      this.authMiddleware.tokenVerification,
      
      this.overviewService.getAllUsers
    );
  }
  public getRoutes() {
    return this.router;
  }
}
