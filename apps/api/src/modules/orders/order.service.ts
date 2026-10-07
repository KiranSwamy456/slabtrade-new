import { Order, OrderItem } from "@prisma/client";

import { NotFoundError } from "@common/errors";

import { OrderRepository } from "./order.repository";
import type { CreateOrderInput, UpdateOrderStatusInput } from "./order.schema";

type OrderWithItems = Order & { items: OrderItem[] };

function generateOrderNumber(): string {
  return `SLB-${Date.now().toString(36).toUpperCase()}`;
}

export class OrderService {
  private readonly orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(customerId: string, data: CreateOrderInput) {
    const { items, ...shipping } = data;

    const order = await this.orderRepository.createOrder(
      customerId,
      generateOrderNumber(),
      shipping,
      items,
    );

    return this.toOrderResponse(order);
  }

  async getOrdersForCustomer(customerId: string) {
    const orders = await this.orderRepository.findByCustomerId(customerId);

    return orders.map((order) => this.toOrderResponse(order));
  }

  async getAllOrders() {
    const orders = await this.orderRepository.findAll();

    return orders.map((order) => ({
      ...this.toOrderResponse(order),
      customer: order.customer,
    }));
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const existing = await this.orderRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("Order not found");
    }

    const order = await this.orderRepository.updateStatus(id, data.status);

    return this.toOrderResponse(order);
  }

  async getOrderItemsForVendor(vendorId: string) {
    const items = await this.orderRepository.findItemsByVendorId(vendorId);

    return items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      orderNumber: item.order.orderNumber,
      orderStatus: item.order.status,
      customer: item.order.customer,
      materialName: item.materialName,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      lineTotal: Number(item.lineTotal),
      createdAt: item.createdAt,
    }));
  }

  private toOrderResponse(order: OrderWithItems) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      status: order.status,
      paymentMethod: order.paymentMethod,
      subtotal: Number(order.subtotal),
      totalAmount: Number(order.totalAmount),
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddressLine1: order.shippingAddressLine1,
      shippingAddressLine2: order.shippingAddressLine2,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      items: order.items.map((item) => ({
        id: item.id,
        slabListingId: item.slabListingId,
        vendorId: item.vendorId,
        materialName: item.materialName,
        unitPrice: Number(item.unitPrice),
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
      })),
      createdAt: order.createdAt,
    };
  }
}
