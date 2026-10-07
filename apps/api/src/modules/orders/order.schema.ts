import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        slabListingId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "Cart must contain at least one item"),

  paymentMethod: z.enum(["COD", "UPI"], {
    message: "Select a payment method",
  }),

  shippingName: z.string().min(2, "Name must be at least 2 characters"),
  shippingPhone: z.string().min(7, "Enter a valid phone number"),
  shippingAddressLine1: z.string().min(3, "Address is required"),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingPostalCode: z.string().min(3, "Postal code is required"),
  shippingCountry: z.string().min(2, "Country is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_OPTIONS, { message: "Select a valid status" }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
