import { RequestHandler } from "express";
import prisma from "../../database/PgDB";
import { NotFoundError } from "../../errors";

export class UsersService {
  public getUserProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      if (!userId) {
        throw new NotFoundError("User not found");
      }
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          carts: true,
          orders: {
            skip,
            take: pageSize,
          },
        },
      });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      const totalOrders = await prisma.order.count({
        where: { userId },
      });
      const totalPages = Math.ceil(totalOrders / pageSize);
      res.status(200).json({
        user,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          pageSize,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
