import { SlabListing } from "@prisma/client";

import { SlabRepository } from "./slab.repository";
import type { CreateSlabListingInput } from "./slab.schema";

export class SlabService {
  private readonly slabRepository: SlabRepository;

  constructor() {
    this.slabRepository = new SlabRepository();
  }

  async createSlabListing(
    vendorId: string,
    data: CreateSlabListingInput,
    images: string[],
  ) {
    const listing = await this.slabRepository.createSlabListing(
      vendorId,
      data,
      images,
    );

    return this.toListingResponse(listing);
  }

  async getVendorListings(vendorId: string) {
    const listings = await this.slabRepository.findByVendorId(vendorId);

    return listings.map((listing) => this.toListingResponse(listing));
  }

  private toListingResponse(listing: SlabListing) {
    return {
      id: listing.id,
      vendorId: listing.vendorId,
      materialName: listing.materialName,
      thickness: listing.thickness,
      slabsPerLot: listing.slabsPerLot,
      lotsPerContainer: listing.lotsPerContainer,
      lengthMin: listing.lengthMin,
      lengthMax: listing.lengthMax,
      widthMin: listing.widthMin,
      widthMax: listing.widthMax,
      unitPrice: Number(listing.unitPrice),
      colorCategory: listing.colorCategory,
      veinPattern: listing.veinPattern,
      images: listing.images,
      isActive: listing.isActive,
      createdAt: listing.createdAt,
    };
  }
}
