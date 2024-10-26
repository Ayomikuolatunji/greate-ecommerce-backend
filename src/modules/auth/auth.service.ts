import StatusCodes from "http-status-codes";
import crypto from "crypto";
import { RequestHandler } from "express";
import { JsonWebTokenService } from "../../source/common/services/jsonwebtoken";
import { ServerUtils } from "../../helpers/utils";
import { BcryptHashingService } from "../../source/common/services/hashing/bcrypt.hash";
import { ISystemTokenService } from "../../source/common/services/token";
import prisma from "../../database/PgDB";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors";
import { EmailValidator } from "../../source/common/services/emailValidator";
import { InternalServerError } from "../../errors/InternalServerError";
import { UserEmails } from "../../emails/auth-sender";
import { ENVIRONMENT_VARIABLES } from "../../configurations/config";
import { userType } from "@prisma/client";

export class UserAuthentication {
  private notFoundMessage = "Account does not exist";
  private utils = new ServerUtils();
  private email = new UserEmails();
  private bcryptHashingService = new BcryptHashingService();
  private jsonWebTokenService = new JsonWebTokenService();
  private systemTokenService = new ISystemTokenService();
  private emailValidator = new EmailValidator();

  public createUser: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!this.emailValidator.isEmailValid(email)) {
        throw new BadRequestError("Invalid email format");
      }
      let findUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (findUser) {
        throw new BadRequestError("User already exist");
      }

      const userFields: { email: string; password: string; avatar: string } = {
        email,
        password: await this.bcryptHashingService.hash(password),
        avatar: this.bcryptHashingService.generateAvatar(email),
      };
      const createStudent = await prisma.user.create({
        data: {
          email: userFields.email.toLowerCase()?.trim(),
          password: userFields.password,
          avatar: userFields.avatar,
          userType: "User",
        },
      });
      if (!createStudent) {
        throw new InternalServerError("Encounter error");
      }
      const token = this.systemTokenService.generateOTP();
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          otp: token,
          tokenExpirationTime: new Date(),
        },
      });
      await this.email.BlastSignupUser({ email: userFields.email, fullName: `` });
      await this.email.blastUserEmailVerificationTokenMessage(
        { email, token },
        "Email verification token"
      );
      res.status(201).json({ message: "Your account is successfully created" });
    } catch (error) {
      next(error);
    }
  };

  public completeProfileRegistration: RequestHandler = async (req, res, next) => {
    const userId = req.authId;
    const { firstName, lastName, gender } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new Error("User not found");
      }
      if (!existingUser.isVerified) {
        throw new UnauthorizedError("You are not authorized until you complete email verification");
      }
      const profile = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName,
          lastName: lastName,
          gender: gender,
        },
      });
      res
        .status(StatusCodes.OK)
        .json({ message: "You have created your ABS profile.", data: profile });
    } catch (error) {
      next(error);
    }
  };

  public login: RequestHandler = async (req, res, next) => {
    try {
      const email = req.body.email as string;
      const password = req.body.password;
      const findUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!findUser) throw new NotFoundError("User not found");
      const hash = await this.bcryptHashingService.verify(password, findUser?.password as string);
      if (!hash) {
        throw new BadRequestError("Invalid password");
      }
      if (!findUser.isVerified) {
        throw new BadRequestError("Please, verify your email, before you can login");
      }
      res.status(StatusCodes.OK).json({
        message: "Login successfully",
        user_credentials: {
          token: this.jsonWebTokenService.sign(
            {
              email,
              authId: findUser?.id as string,
            },
            { expiresIn: "30d" }
          ),
          userType: findUser.userType,
          email: findUser.email,
          userId: findUser?.id,
          isVerified: findUser?.isVerified,

          avatar: findUser?.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword: RequestHandler = async (req, res, next) => {
    const { password, email, otp } = req.body as { password: string; email: string; otp: string };
    try {
      if (!this.emailValidator.isEmailValid(email)) {
        throw new BadRequestError("Invalid email format");
      }

      const findUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!findUser) {
        throw new NotFoundError("Student not found!");
      }
      if (findUser.otp !== otp) {
        throw new InternalServerError("Invalid otp");
      }
      const dateElapseTime = this.utils.diff_minutes(findUser?.tokenExpirationTime!, new Date());
      if (dateElapseTime > 10) {
        throw new BadRequestError("Token expired, try again");
      }
      await prisma.user.update({
        where: {
          id: findUser?.id,
        },
        data: {
          password: await this.bcryptHashingService.hash(password),
        },
      });
      res.status(StatusCodes.OK).json({
        message: "Your password has been successfully reset, you can now login",
        passwordReset: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmailAccount: RequestHandler = async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const identifier = req.body.email as string;
      let findUser;
      if (this.emailValidator.isEmailValid(identifier)) {
        findUser = await prisma.user.findUnique({
          where: {
            email: identifier.toLowerCase(),
          },
        });
      }
      if (!findUser) throw new NotFoundError(this.notFoundMessage);
      if (findUser.otp !== otp) {
        throw new BadRequestError("Invalid otp");
      }
      if (findUser.isVerified) {
        throw new BadRequestError("This email is already verified");
      }
      const dateElapseTime = this.utils.diff_minutes(findUser?.tokenExpirationTime!, new Date());
      if (dateElapseTime > 5) {
        throw new BadRequestError("Token expired, try again");
      } else {
        await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            isVerified: true,
          },
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Login successfully",
        user_credentials: {
          token: this.jsonWebTokenService.sign(
            {
              email: findUser.email,
              authId: findUser?.id as string,
            },
            { expiresIn: "30d" }
          ),
          email: findUser.email,
          userId: findUser?.id,
          isVerified: findUser?.isVerified,
          isEmail_verified: findUser?.isVerified,
          avatar: findUser?.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public requestOtp: RequestHandler = async (req, res, next) => {
    try {
      const email = req.body.email as string;
      let findUser;
      if (this.emailValidator.isEmailValid(email)) {
        findUser = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });
      }
      if (!findUser) throw new NotFoundError(this.notFoundMessage);
      const token = this.systemTokenService.generateOTP();
      await prisma.user.update({
        where: {
          email: findUser.email,
        },
        data: {
          otp: token,
          tokenExpirationTime: new Date(),
        },
      });
      await this.email.blastRenewUserTokenMessage({ email, token }, "User token");
      res.status(StatusCodes.OK).json({ message: "Opt sent successfully" });
    } catch (error) {
      next(error);
    }
  };
  public verifyOTP: RequestHandler = async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const identifier = req.body.email as string;
      let findUser;
      if (this.emailValidator.isEmailValid(identifier.toLowerCase())) {
        findUser = await prisma.user.findUnique({
          where: {
            email: identifier.toLowerCase(),
          },
        });
      }
      if (!findUser) throw new NotFoundError(this.notFoundMessage);
      if (findUser.otp !== otp) {
        throw new InternalServerError("Invalid otp");
      }
      const dateElapseTime = this.utils.diff_minutes(findUser?.tokenExpirationTime!, new Date());
      if (dateElapseTime > 5) {
        throw new BadRequestError("Token expired, try again");
      }
      res.status(StatusCodes.OK).json({ message: "OTP verified successfully", otp: otp });
    } catch (error) {
      next(error);
    }
  };

  public forgetPasswordOtp: RequestHandler = async (req, res, next) => {
    try {
      const email = req.body.email as string;
      if (!this.emailValidator.isEmailValid(email)) {
        throw new BadRequestError("Invalid email format");
      }
      const findUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!findUser) {
        throw new NotFoundError("User Account not found");
      }
      const token = crypto.randomBytes(20).toString("hex");
      const tokenExpirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
      await prisma.user.update({
        where: {
          email: email.toLowerCase(),
        },
        data: {
          otp: token,
          tokenExpirationTime: tokenExpirationTime,
        },
      });
      const resetLink =
        ENVIRONMENT_VARIABLES.NODE_ENV === "development"
          ? `http://localhost:3000/auth/reset-password?code=${token}&email=${findUser.email}`
          : `https://www.4tk.shop/auth/reset-password?code=${token}`;

      await this.email.blastUserForgotTokenMessage(
        {
          email: findUser.email,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          resetLink,
        },
        "Forget Password Reset Link"
      );

      res.status(StatusCodes.OK).json({ message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  };
}
