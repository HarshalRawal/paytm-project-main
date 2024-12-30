-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "upi" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;
