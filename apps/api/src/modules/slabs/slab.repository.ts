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
        portOfLoading: data.portOfLoading,
        images,
      },
    });
  }

  async findActiveListings() {
    return prisma.slabListing.findMany({
      where: {
        status: 1,
        approvalStatus: "Approved",
        deletedAt: null,
      },
      include: {
        vendor: {
          select: { id: true, firstName: true, lastName: true, fullName: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAllForAdmin() {
    return prisma.slabListing.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        vendor: {
          select: { id: true, firstName: true, lastName: true, fullName: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.slabListing.findUnique({ where: { id } });
  }

  async approve(id: string, customerPrice: number) {
    return prisma.slabListing.update({
      where: { id },
      data: {
        approvalStatus: "Approved",
        customerPrice,
        approvedAt: new Date(),
      },
    });
  }

  async reject(id: string) {
    return prisma.slabListing.update({
      where: { id },
      data: {
        approvalStatus: "Rejected",
        customerPrice: null,
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

  async findByIdForVendor(id: string, vendorId: string) {
    return prisma.slabListing.findFirst({
      where: {
        id,
        vendorId,
        deletedAt: null,
      },
    });
  }

  async updateStatus(id: string, status: number) {
    return prisma.slabListing.update({
      where: { id },
      data: { status },
    });
  }
}
