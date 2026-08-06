-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetBlockedUntil" TIMESTAMP(3),
ADD COLUMN     "passwordResetLastSentAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetResendCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetTokenHash" TEXT;
