-- CreateTable
CREATE TABLE "slab_listings" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "thickness" TEXT NOT NULL,
    "slabsPerLot" INTEGER NOT NULL,
    "lotsPerContainer" INTEGER NOT NULL DEFAULT 7,
    "lengthMin" DOUBLE PRECISION NOT NULL,
    "lengthMax" DOUBLE PRECISION NOT NULL,
    "widthMin" DOUBLE PRECISION NOT NULL,
    "widthMax" DOUBLE PRECISION NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "colorCategory" TEXT NOT NULL,
    "veinPattern" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "slab_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slab_listings_vendorId_idx" ON "slab_listings"("vendorId");

-- AddForeignKey
ALTER TABLE "slab_listings" ADD CONSTRAINT "slab_listings_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
