/*
  Warnings:

  - You are about to drop the column `user1Id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participant1Id,participant2Id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participant1Id` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant2Id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- DropIndex
DROP INDEX "Chat_user1Id_user2Id_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "participant1Id" TEXT NOT NULL,
ADD COLUMN     "participant2Id" TEXT NOT NULL,
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attachmentUrl" TEXT;

-- CreateIndex
CREATE INDEX "Chat_participant1Id_participant2Id_idx" ON "Chat"("participant1Id", "participant2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_participant1Id_participant2Id_key" ON "Chat"("participant1Id", "participant2Id");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");
