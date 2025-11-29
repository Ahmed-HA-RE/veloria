/*
  Warnings:

  - You are about to drop the column `bannedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `bannedReason` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "bannedAt",
DROP COLUMN "bannedReason",
ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT;
