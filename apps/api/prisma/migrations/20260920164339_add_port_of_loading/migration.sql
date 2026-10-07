-- AlterTable
ALTER TABLE "slab_listings" ADD COLUMN     "portOfLoading" TEXT NOT NULL DEFAULT 'Mundra';
ALTER TABLE "slab_listings" ALTER COLUMN "portOfLoading" DROP DEFAULT;
