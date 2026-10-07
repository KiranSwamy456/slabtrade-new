import { apiRequest } from "@/lib/api";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "COD" | "UPI";

export type OrderItem = {
  id: string;
  slabListingId: string;
  vendorId: string;
  materialName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  createdAt: string;
};

export type OrderCustomer = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
};

export type AdminOrder = Order & { customer: OrderCustomer };

export type VendorOrderItem = {
  id: string;
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  customer: OrderCustomer;
  materialName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  createdAt: string;
};

export type CreateOrderRequest = {
  items: { slabListingId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

export type CreateOrderResponse = {
  success: boolean;
  message: string;
  data: Order;
};

export type ListMyOrdersResponse = {
  success: boolean;
  message: string;
  data: Order[];
};

export type ListAllOrdersResponse = {
  success: boolean;
  message: string;
  data: AdminOrder[];
};

export type ListVendorOrderItemsResponse = {
  success: boolean;
  message: string;
  data: VendorOrderItem[];
};

export type UpdateOrderStatusResponse = {
  success: boolean;
  message: string;
  data: Order;
};

export const orderService = {
  async placeOrder(
    data: CreateOrderRequest,
    accessToken: string,
  ): Promise<CreateOrderResponse> {
    return apiRequest<CreateOrderResponse>("/orders", {
      method: "POST",
      token: accessToken,
      body: JSON.stringify(data),
    });
  },

  async getMyOrders(accessToken: string): Promise<ListMyOrdersResponse> {
    return apiRequest<ListMyOrdersResponse>("/orders/mine", {
      method: "GET",
      token: accessToken,
    });
  },

  async getAllOrders(accessToken: string): Promise<ListAllOrdersResponse> {
    return apiRequest<ListAllOrdersResponse>("/orders", {
      method: "GET",
      token: accessToken,
    });
  },

  async getVendorOrderItems(
    accessToken: string,
  ): Promise<ListVendorOrderItemsResponse> {
    return apiRequest<ListVendorOrderItemsResponse>("/orders/vendor", {
      method: "GET",
      token: accessToken,
    });
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    accessToken: string,
  ): Promise<UpdateOrderStatusResponse> {
    return apiRequest<UpdateOrderStatusResponse>(`/orders/${id}/status`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify({ status }),
    });
  },
};
