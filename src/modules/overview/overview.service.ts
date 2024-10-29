import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OverviewService {
  // Method to get overview statistics
  public getOverviewStats: RequestHandler = async (req, res, next) => {
    try {
      // Fetch total number of users
      const totalUsers = await prisma.user.count();

      // Fetch the number of new users in the last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const usersLastMonth = await prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
          },
        },
      });

      const userGrowth = totalUsers - usersLastMonth;

      // Fetch total number of products
      const totalProducts = await prisma.product.count();

      // Fetch total number of sales (assuming you have an Order model)
      const totalSales = await prisma.order.count();

      // Fetch sales growth in the last month (using createdAt date in Orders)
      const salesLastMonth = await prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonth,
          },
        },
      });
      const salesGrowth = totalSales - salesLastMonth;

      res.status(200).json({
        totalUsers,
        userGrowth,
        totalProducts,
        totalSales,
        salesGrowth,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to fetch all users (paginated)
  public getAllUsers: RequestHandler = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await prisma.user.findMany({
        skip,
        take: limit,
      });

      const totalUsers = await prisma.user.count();

      res.status(200).json({
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      });
    } catch (error) {
      next(error);
    }
  };
}
