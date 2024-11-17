import { RequestHandler } from "express";
import { ENVIRONMENT_VARIABLES } from "../../configurations/config";
import axios from "axios";
import { BadRequestError } from "../../errors";
import prisma from "../../database/PgDB";

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
        include: { user: true, orderItems: { include: { product: true } } },
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  public getOrder: RequestHandler = async (req, res, next) => {
    try {
      const orders = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { user: true, orderItems: { include: { product: true } } },
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

  public makePayment: RequestHandler = async (req, res, next) => {
    const authId = req.authId;
    if (!req.body.orderId) {
      throw new BadRequestError("orderId is required");
    }
    const order = await prisma.order.findUnique({
      where: {
        id: req.body.orderId,
      },
    });
    if (!order) {
      throw new BadRequestError("Order not found");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: authId,
      },
    });
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const callback_url =
      ENVIRONMENT_VARIABLES.NODE_ENV === "development"
        ? `http://localhost:3000/order/${req.body.orderId}`
        : ENVIRONMENT_VARIABLES.NODE_ENV === "staging"
        ? `https://www.4tk.shop/order/${req.body.orderId}`
        : `https://www.4tk.shop/order/${req.body.orderId}`;

    const makePayment = await axios({
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENVIRONMENT_VARIABLES.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email: user.email,
        amount: order.totalPrice,
        callback_url: callback_url,
        currency: "NGN",
        transaction_charge: 10,
        metadata: {
          userId: user.id,
          orderId: order.id,
        },
      }),
      url: "https://api.paystack.co/transaction/initialize",
    });

    res.status(200).json({ data: { ...makePayment.data } });
  };
  public deleteOrder: RequestHandler = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      await prisma.orderItem.deleteMany({
        where: { orderId },
      });
      await prisma.order.delete({
        where: { id: orderId },
      });

      res.status(200).json({ message: "Order and its items deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
