/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'TRANSACTION');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ADD COLUMN     "textStatus" "MessageStatus",
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "content" DROP NOT NULL;
