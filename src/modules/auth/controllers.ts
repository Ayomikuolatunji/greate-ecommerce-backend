import { Router } from "express";
import { UserAuthentication } from "./auth.service";

import { validate } from "express-validation";

import {
  emailOtpValidation,
  loginValidation,
  signupUserValidation,
  emailValidation,
  resetPasswordValidation,
  completeProfileRegistrationValidation,
} from "./validation";
import { AuthMiddleware } from "../../middlewares/auth/authToken";

export class AuthRoutes {
  private router: Router;
  private auth = new UserAuthentication();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.InitAuthRoute();
    this.authMiddleware = new AuthMiddleware();
  }

  private InitAuthRoute() {
    this.router.post("/signup", validate(signupUserValidation, {}, {}), this.auth.createUser);
    this.router.post("/login", validate(loginValidation, {}, {}), this.auth.login);

    this.router.post(
      "/verify-email",
      validate(emailOtpValidation, {}, {}),
      this.auth.verifyEmailAccount
    );
    this.router.post(
      "/forgot-password",
      validate(emailValidation, {}, {}),
      this.auth.forgetPasswordOtp
    );
    this.router.post("/request-otp", validate(emailValidation, {}, {}), this.auth.requestOtp);
    this.router.post("/verify-otp", validate(emailOtpValidation, {}, {}), this.auth.verifyOTP);
    this.router.post(
      "/complete-profile-registration",
      this.authMiddleware.tokenVerification,
      validate(completeProfileRegistrationValidation, {}, {}),
      this.auth.completeProfileRegistration
    );
    this.router.post(
      "/reset-password",
      validate(resetPasswordValidation, {}, {}),
      this.auth.resetPassword
    );
  }
  public getRoutes() {
    return this.router;
  }
}
