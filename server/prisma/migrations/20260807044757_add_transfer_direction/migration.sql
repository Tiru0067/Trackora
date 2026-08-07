-- CreateEnum
CREATE TYPE "TransferDirection" AS ENUM ('IN', 'OUT');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_transferId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transferDirection" "TransferDirection";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
