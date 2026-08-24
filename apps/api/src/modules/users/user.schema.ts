import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().optional(),

  email: z.string().email("Invalid email address"),

  phone: z.string().optional(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["Customer", "Vendor", "Support", "Admin"]),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
