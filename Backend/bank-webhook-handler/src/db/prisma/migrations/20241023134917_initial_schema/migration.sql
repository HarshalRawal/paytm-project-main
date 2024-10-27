-- CreateEnum
CREATE TYPE "eventType" AS ENUM ('TOP_UP', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "eventType" "eventType" NOT NULL,
    "published" BOOLEAN NOT NULL,
    "Payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);
