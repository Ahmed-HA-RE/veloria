/*
  Warnings:

  - A unique constraint covering the columns `[sessionCartId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "sessionCartId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionCartId_key" ON "Cart"("sessionCartId");
