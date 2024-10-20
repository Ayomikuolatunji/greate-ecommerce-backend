import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { BadRequestError } from "../errors";
import { ENVIRONMENT_VARIABLES } from "../configurations/config";

export class ServerUtils {
  emailRegex: RegExp;
  constructor() {
    this.emailRegex = /\S+@\S+\.\S+/;
  }
  public emailRegexFunction() {
    return this.emailRegex;
  }
  public salt = async () => await bcrypt.genSalt(10);

  public diff_minutes(dt2: Date, dt1: Date) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  public generateOTP(): string {
    const OTP = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    return OTP;
  }

  public hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, await this.salt());
    return hashedPassword;
  };

  public async validatePassword(password: string, comparePassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, comparePassword);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid password");
    }
    return isPasswordValid;
  }
  public createToken(authId: string): string {
    const token = jwt.sign({ authId }, ENVIRONMENT_VARIABLES.JWT_SECRET_KEY, { expiresIn: "30d" });
    return token;
  }

  public generateVerificationCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
}
