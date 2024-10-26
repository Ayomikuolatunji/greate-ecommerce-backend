import { NextFunction, Response } from "express";
import Jwt from "jsonwebtoken";
import { AuthRequest } from "../../interfaces/types";
import { BadRequestError } from "../../errors";
import { ENVIRONMENT_VARIABLES } from "../../configurations/config";
import prisma from "../../database/PgDB";

export class AuthMiddleware {
  /**
   * This middleware will set and verify the user making request to the server resources
   * @param AuthRequest
   * @param res
   * @param next
   */

  public   tokenVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.get("Authorization");
      if (!authHeader) {
        throw new BadRequestError("Authorization token is required");
      }
      let decodedToken: any;
      const token = authHeader?.split(" ")[1];
      decodedToken = Jwt.verify(token as string, `${ENVIRONMENT_VARIABLES.JWT_SECRET_KEY}`);
      if (!token || !decodedToken) {
        throw new BadRequestError("Invalid token");
      }
      const user = await prisma.user.findUnique({ where: { id: decodedToken.authId } });
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      req.authId = decodedToken.authId;
      //   req.userType = decodedToken.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}
