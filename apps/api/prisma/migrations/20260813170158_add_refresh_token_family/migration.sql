-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "familyId" TEXT;

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");
