-- Add the new integer status column (1 = active, 0 = inactive)
ALTER TABLE "slab_listings" ADD COLUMN "status" INTEGER NOT NULL DEFAULT 1;

-- Backfill status from the previous boolean flag
UPDATE "slab_listings" SET "status" = CASE WHEN "isActive" THEN 1 ELSE 0 END;

-- Drop the old boolean column
ALTER TABLE "slab_listings" DROP COLUMN "isActive";
