/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "walletId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_walletId_key" ON "users"("walletId");
