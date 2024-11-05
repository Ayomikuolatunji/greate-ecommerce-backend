import { RequestHandler } from "express";
import prisma from "../../database/PgDB";
import { BadRequestError, NotFoundError } from "../../errors";

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
      let cartQuantity;
      if (existingCartItem) {
        cartQuantity = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        cartQuantity = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      res
        .status(200)
        .json({ message: "Item added to cart", quantity: quantity, productId: productId });
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
  public deleteCartItem: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.authId;
      const { itemId } = req.params;

      const cart = await prisma.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
      });

      if (!item || item.cartId !== cart.id) {
        throw new NotFoundError("Cart item not found");
      }

      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  };
}
