import { Router } from "express";
import { OverviewService } from "./overview.service";

export class OverviewRoutes {
  private router: Router;
  private overviewService: OverviewService;
  constructor() {
    this.router = Router();
    this.overviewService = new OverviewService();
    this.initOverviewRoutes();
  }
  private initOverviewRoutes() {
    this.router.get("/overview/stats", this.overviewService.getOverviewStats);
    this.router.get("/users", this.overviewService.getAllUsers);
  }
  public getRoutes() {
    return this.router;
  }
}
