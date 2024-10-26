import { Router } from "express";
import { OverviewService } from "./overview.service";
import { AuthMiddleware } from "../../middlewares/auth/authToken";

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
      this.overviewService.getOverviewStats
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
