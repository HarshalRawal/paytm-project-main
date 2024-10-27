-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "published" SET DEFAULT false;
