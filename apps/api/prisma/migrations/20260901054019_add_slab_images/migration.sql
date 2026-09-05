-- AlterTable
ALTER TABLE "slab_listings" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
