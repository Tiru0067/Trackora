-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationLastSentAt" TIMESTAMP(3),
ADD COLUMN     "emailVerificationBlockedUntil" TIMESTAMP(3),
ADD COLUMN     "emailVerificationResendCount" INTEGER NOT NULL DEFAULT 0;
