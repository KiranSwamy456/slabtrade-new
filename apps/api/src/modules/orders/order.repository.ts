import { prisma } from "@database/prisma";
import { BadRequestError } from "@common/errors";

import type { CreateOrderInput } from "./order.schema";

type ShippingInput = Omit<CreateOrderInput, "items">;

export class OrderRepository {
  async createOrder(
    customerId: string,
    orderNumber: string,
    shipping: ShippingInput,
    items: CreateOrderInput["items"],
  ) {
    return prisma.$transaction(async (tx) => {
      const listingIds = items.map((item) => item.slabListingId);

      const listings = await tx.slabListing.findMany({
        where: {
          id: { in: listingIds },
          status: 1,
          approvalStatus: "Approved",
          deletedAt: null,
        },
      });

      const listingById = new Map(listings.map((listing) => [listing.id, listing]));

      if (listingById.size !== new Set(listingIds).size) {
        throw new BadRequestError(
          "One or more items in your cart are no longer available",
        );
      }

      let subtotal = 0;

      const orderItemsData = items.map((item) => {
        const listing = listingById.get(item.slabListingId)!;
        // Customers are charged the admin-approved price, never the vendor's.
        const unitPrice = Number(listing.customerPrice);
        const lineTotal = unitPrice * item.quantity;

        subtotal += lineTotal;

        return {
          slabListingId: listing.id,
          vendorId: listing.vendorId,
          materialName: listing.materialName,
          unitPrice,
          quantity: item.quantity,
          lineTotal,
        };
      });

      return tx.order.create({
        data: {
          orderNumber,
          customerId,
          subtotal,
          totalAmount: subtotal,
          paymentMethod: shipping.paymentMethod,
          shippingName: shipping.shippingName,
          shippingPhone: shipping.shippingPhone,
          shippingAddressLine1: shipping.shippingAddressLine1,
          shippingAddressLine2: shipping.shippingAddressLine2,
          shippingCity: shipping.shippingCity,
          shippingState: shipping.shippingState,
          shippingPostalCode: shipping.shippingPostalCode,
          shippingCountry: shipping.shippingCountry,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async findByCustomerId(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll() {
    return prisma.order.findMany({
      include: {
        items: true,
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findItemsByVendorId(vendorId: string) {
    return prisma.orderItem.findMany({
      where: { vendorId },
      include: {
        order: {
          include: {
            customer: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
