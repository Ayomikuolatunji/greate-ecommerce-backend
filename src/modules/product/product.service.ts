import { RequestHandler } from "express";
import prisma from "../../database/PgDB";
import { CloudinaryFunctions } from "../../helpers/cloudinary";

export class ProductService extends CloudinaryFunctions {
  public createProducts: RequestHandler = async (req, res, next) => {
    try {
      const { name, description, price, size, color, quantity } = req.body;
      const files = req.files as {
        salesCoverPicture?: Express.Multer.File[];
        subImages?: Express.Multer.File[];
      };
      if (!files.salesCoverPicture || files.salesCoverPicture.length === 0) {
        return res.status(400).json({ error: "salesCoverPicture is required" });
      }

      const salesCoverPictureUpload = await this.uploadFile(files.salesCoverPicture[0].path);
      const salesCoverPictureUrl = salesCoverPictureUpload.secure_url;
      const subImages = files.subImages
        ? await Promise.all(
            files.subImages.map(async (file: Express.Multer.File) => {
              const uploadResponse = await this.uploadFile(file.path);
              return uploadResponse.secure_url;
            })
          )
        : [];

      await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          size,
          color,
          quantity,
          salesCoverPicture: salesCoverPictureUrl,
          subImages,
        },
      });

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      next(error);
    }
  };
  public editProduct: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, size, color, quantity } = req.body
      const files = req.files as {
        salesCoverPicture?: Express.Multer.File[];
        subImages?: Express.Multer.File[];
      };
      let salesCoverPictureUrl: string | undefined = undefined;
      if (files.salesCoverPicture) {
        const salesCoverPictureUpload = await this.uploadFile(files.salesCoverPicture[0].path);
        salesCoverPictureUrl = salesCoverPictureUpload.secure_url;
      }
      const subImages = files.subImages
        ? await Promise.all(
            files.subImages.map(async (file: Express.Multer.File) => {
              const uploadResponse = await this.uploadFile(file.path);
              return uploadResponse.secure_url;
            })
          )
        : undefined;

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          size,
          color,
          quantity,
          ...(salesCoverPictureUrl && { salesCoverPicture: salesCoverPictureUrl }),
          ...(subImages && { subImages }),
          updatedAt: new Date(),
        },
      });

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      next(error);
    }
  };
  
  public getAllProducts: RequestHandler = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string);
      const skip = (page - 1) * limit;
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

  public searchProducts: RequestHandler = async (req, res, next) => {
    try {
      const { query } = req.query;
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query as string, mode: "insensitive" } },
            { description: { contains: query as string, mode: "insensitive" } },
          ],
        },
      });
      res.status(200).json({
        products,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete Product
  public deleteProduct: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

      await prisma.product.update({
        where: { id },
        data: {
          productStatus: "DELETED",
        },
      });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
