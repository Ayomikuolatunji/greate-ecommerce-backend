-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DELETED', 'ACTIVE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productStatus" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
