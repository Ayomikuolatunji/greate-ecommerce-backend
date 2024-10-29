import { RequestHandler } from "express";
import prisma from "../../database/PgDB";
import { BadRequestError, NotFoundError } from "../../errors";

export class UsersService {
  public getUserProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      if (!userId) {
        throw new NotFoundError("User not found");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Cart: true,
          Order: true,
        },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}
