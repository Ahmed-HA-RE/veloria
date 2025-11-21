/*
  Warnings:

  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentResult" JSON;

-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
