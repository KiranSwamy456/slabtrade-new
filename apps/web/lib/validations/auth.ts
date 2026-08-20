import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),

    lastName: z.string().optional(),

    email: z.string().email("Please enter a valid email address"),

    phone: z.string().optional(),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
