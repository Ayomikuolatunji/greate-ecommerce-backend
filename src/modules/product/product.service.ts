import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductService {
  public createProducts: RequestHandler = async (req, res, next) => {
    try {
      const { name, description, price, size, color, quantity, salesCoverPicture, subImages } =
        req.body;
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          size,
          color,
          quantity,
          salesCoverPicture,
          subImages,
        },
      });
      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  };

  public getAllProducts: RequestHandler = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      // Fetch products with pagination
      const products = await prisma.product.findMany({
        skip,
        take: limit,
      });
      const totalProducts = await prisma.product.count();

      res.status(200).json({
        products,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductById: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const relatedProducts = await prisma.product.findMany({
        where: {
          OR: [{ name: product.name }, { price: product.price }, { size: product.size }],
          id: {
            not: id,
          },
        },
        take: 7,
      });

      res.status(200).json({
        product,
        relatedProducts,
      });
    } catch (error) {
      next(error);
    }
  };
}
