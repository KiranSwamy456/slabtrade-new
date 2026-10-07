import { SlabListing } from "@prisma/client";

import { NotFoundError } from "@common/errors/NotFoundError";

import { SlabRepository } from "./slab.repository";
import type { ApproveSlabListingInput, CreateSlabListingInput } from "./slab.schema";

function resolveVendorName(vendor: {
  fullName: string | null;
  firstName: string;
  lastName: string | null;
}): string {
  return vendor.fullName || `${vendor.firstName} ${vendor.lastName ?? ""}`.trim();
}

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

  async getMarketplaceListings() {
    const listings = await this.slabRepository.findActiveListings();

    return listings.map((listing) => ({
      ...this.toListingResponse(listing),
      // Customers only ever see the admin-set price, never the vendor's.
      unitPrice: Number(listing.customerPrice),
      vendorName: resolveVendorName(listing.vendor),
    }));
  }

  async getAdminListings() {
    const listings = await this.slabRepository.findAllForAdmin();

    return listings.map((listing) => ({
      ...this.toListingResponse(listing),
      vendorName: resolveVendorName(listing.vendor),
      customerPrice:
        listing.customerPrice === null ? null : Number(listing.customerPrice),
    }));
  }

  async approveListing(id: string, data: ApproveSlabListingInput) {
    const existing = await this.slabRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("Slab listing not found");
    }

    const updated = await this.slabRepository.approve(id, data.customerPrice);

    return this.toListingResponse(updated);
  }

  async rejectListing(id: string) {
    const existing = await this.slabRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("Slab listing not found");
    }

    const updated = await this.slabRepository.reject(id);

    return this.toListingResponse(updated);
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
      portOfLoading: listing.portOfLoading,
      images: listing.images,
      status: listing.status,
      approvalStatus: listing.approvalStatus,
      createdAt: listing.createdAt,
    };
  }
}
