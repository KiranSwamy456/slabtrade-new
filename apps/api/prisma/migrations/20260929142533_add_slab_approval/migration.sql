-- AlterTable
ALTER TABLE "slab_listings" ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "customerPrice" DECIMAL(10,2);

-- Backfill: auto-approve listings that existed before this workflow, at their current vendor price
UPDATE "slab_listings"
SET "approvalStatus" = 'Approved', "customerPrice" = "unitPrice", "approvedAt" = now()
WHERE "deletedAt" IS NULL;
