/*
  Warnings:

  - You are about to drop the column `transactionId` on the `PaymentRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `PaymentRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bankReferenceId]` on the table `PaymentRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bankReferenceId` to the `PaymentRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idempotencyKey` to the `PaymentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'ABONDANED';

-- AlterTable
ALTER TABLE "PaymentRequest" DROP COLUMN "transactionId",
ADD COLUMN     "bankReferenceId" TEXT NOT NULL,
ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRequest_idempotencyKey_key" ON "PaymentRequest"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRequest_bankReferenceId_key" ON "PaymentRequest"("bankReferenceId");
