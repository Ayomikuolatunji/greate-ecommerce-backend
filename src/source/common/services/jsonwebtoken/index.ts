import jwt from "jsonwebtoken";
import { ENVIRONMENT_VARIABLES } from "../../../../configurations/config";

export class JsonWebTokenService {
  public sign<T>(payload: T | any, options?: jwt.SignOptions): string {
    return jwt.sign(payload, ENVIRONMENT_VARIABLES.JWT_SECRET_KEY, options);
  }
  public verify<T>(token: string, options?: jwt.VerifyOptions): T | any | undefined {
    try {
      return jwt.verify(token, ENVIRONMENT_VARIABLES.JWT_SECRET_KEY, options);
    } catch (err) {
      return undefined;
    }
  }
}
