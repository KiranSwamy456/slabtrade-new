import { prisma } from "@database/prisma";

import type { CreateSlabListingInput } from "./slab.schema";

export class SlabRepository {
  async createSlabListing(
    vendorId: string,
    data: CreateSlabListingInput,
    images: string[],
  ) {
    return prisma.slabListing.create({
      data: {
        vendorId,
        materialName: data.materialName,
        thickness: data.thickness,
        slabsPerLot: data.slabsPerLot,
        lengthMin: data.lengthMin,
        lengthMax: data.lengthMax,
        widthMin: data.widthMin,
        widthMax: data.widthMax,
        unitPrice: data.unitPrice,
        colorCategory: data.colorCategory,
        veinPattern: data.veinPattern,
        images,
      },
    });
  }

  async findByVendorId(vendorId: string) {
    return prisma.slabListing.findMany({
      where: {
        vendorId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
