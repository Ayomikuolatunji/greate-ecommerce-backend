import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderService {
  public placeOrder: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      const { deliveryAddress } = req.body;
      const cart = await prisma.cart.findFirst({
        where: { userId: userId! },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const order = await prisma.order.create({
        data: {
          userId: userId!,
          totalPrice,
          deliveryAddress,
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  public getUserOrders: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  public getAllOrders: RequestHandler = async (req, res, next) => {
    try {
      const orders = await prisma.order.findMany({
        include: { user: true, orderItems: { include: { product: true } } },
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };
}
