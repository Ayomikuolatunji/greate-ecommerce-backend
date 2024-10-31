import { RequestHandler } from "express";
import prisma from "../../database/PgDB";

export class OverviewService {
  public getOverviewStats: RequestHandler = async (req, res, next) => {
    try {
      const totalUsers = await prisma.user.count();
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
      const totalProducts = await prisma.product.count();
      const totalSales = await prisma.order.count();
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
  public fetchTransactions: RequestHandler = async (req, res, next) => {
    try {
      const transactions = await prisma.transaction.findMany({
        include: { order: true },
      });
      res.status(200).json({ transactions });
    } catch (error) {
      next(error);
    }
  };
  public fetchOrders: RequestHandler = async (req, res, next) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          orderItems: {
            include: { product: true },
          },
          user: true,
        },
      });

      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  }
}
