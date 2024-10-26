import { RequestHandler } from "express";
import prisma from "../../database/PgDB";
import { BadRequestError } from "../../errors";

export class CartService {
  public addToCart: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      if (!userId) {
        throw new BadRequestError("UserId is required");
      }
      const { productId, quantity } = req.body;
      let cart = await prisma.cart.findFirst({
        where: { userId: userId },
        include: { items: true },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: userId!,
          },
          include: { items: true },
        });
      }
      const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
      next(error);
    }
  };

  public getUserCart: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;

      const cart = await prisma.cart.findFirst({
        where: { userId: userId! },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };
}
