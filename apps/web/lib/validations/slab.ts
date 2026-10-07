import { z } from "zod";

const THICKNESS_RANGES: Record<"2cm" | "3cm", [number, number]> = {
  "2cm": [10, 12],
  "3cm": [5, 8],
};

export const PORT_OF_LOADING_OPTIONS = [
  "Mundra",
  "Kandla",
  "Nhava Sheva (JNPT)",
  "Chennai",
  "Kolkata",
  "Savannah",
  "Houston",
  "Baltimore",
  "New York/New Jersey",
  "Long Beach",
] as const;

export const createSlabListingSchema = z
  .object({
    materialName: z
      .string()
      .min(2, "Material name must be at least 2 characters"),

    thickness: z.enum(["2cm", "3cm"]),

    slabsPerLot: z
      .number({ message: "Slabs per lot is required" })
      .int("Slabs per lot must be a whole number")
      .positive("Slabs per lot must be greater than 0"),

    lengthMin: z
      .number({ message: "Length min is required" })
      .min(100, "Length must be at least 100 inches")
      .max(140, "Length must be at most 140 inches"),

    lengthMax: z
      .number({ message: "Length max is required" })
      .min(100, "Length must be at least 100 inches")
      .max(140, "Length must be at most 140 inches"),

    widthMin: z
      .number({ message: "Width min is required" })
      .min(57, "Width must be at least 57 inches")
      .max(85, "Width must be at most 85 inches"),

    widthMax: z
      .number({ message: "Width max is required" })
      .min(57, "Width must be at least 57 inches")
      .max(85, "Width must be at most 85 inches"),

    unitPrice: z
      .number({ message: "Unit price is required" })
      .positive("Unit price must be greater than 0"),

    colorCategory: z.enum(["Dark", "Light", "White"]),

    veinPattern: z.enum(["Long", "Short"]),

    portOfLoading: z.enum(PORT_OF_LOADING_OPTIONS, {
      message: "Port of loading is required",
    }),
  })
  .refine((data) => data.lengthMin <= data.lengthMax, {
    message: "Length max must be greater than or equal to length min",
    path: ["lengthMax"],
  })
  .refine((data) => data.widthMin <= data.widthMax, {
    message: "Width max must be greater than or equal to width min",
    path: ["widthMax"],
  })
  .superRefine((data, ctx) => {
    const [min, max] = THICKNESS_RANGES[data.thickness];

    if (data.slabsPerLot < min || data.slabsPerLot > max) {
      ctx.addIssue({
        code: "custom",
        path: ["slabsPerLot"],
        message: `Slabs per lot must be between ${min} and ${max} for ${data.thickness} thickness`,
      });
    }
  });

export type CreateSlabListingFormData = z.infer<typeof createSlabListingSchema>;
