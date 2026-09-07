import { SlabListing } from "@prisma/client";

import { NotFoundError } from "@common/errors/NotFoundError";

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

  async setListingStatus(vendorId: string, id: string, status: number) {
    const listing = await this.slabRepository.findByIdForVendor(id, vendorId);

    if (!listing) {
      throw new NotFoundError("Slab listing not found");
    }

    const updated = await this.slabRepository.updateStatus(id, status);

    return this.toListingResponse(updated);
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
      status: listing.status,
      createdAt: listing.createdAt,
    };
  }
}
