import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth/authToken";
import { UsersService } from "./users.service";

export class UserRoutes {
  private router: Router;
  private userService: UsersService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userService = new UsersService();
    this.authMiddleware = new AuthMiddleware();
    this.InitCartRoutes();
  }

  private InitCartRoutes() {
    this.router.get(
      "/user/profile",
      this.authMiddleware.tokenVerification,
      this.userService.getUserProfile
    );
  }

  public getRoutes() {
    return this.router;
  }
}
