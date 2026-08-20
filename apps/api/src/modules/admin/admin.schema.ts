import { z } from "zod";

export const createAdminUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z.string().trim().optional(),

  fullName: z.string().trim().optional(),

  email: z.string().trim().email("Please enter a valid email address"),

  phone: z.string().trim().optional(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  roleId: z.string().min(1, "Role is required"),
});

export type CreateAdminUserRequest = z.infer<typeof createAdminUserSchema>;
