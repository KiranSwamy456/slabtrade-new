import { z } from "zod";

const THICKNESS_RANGES: Record<"2cm" | "3cm", [number, number]> = {
  "2cm": [10, 12],
  "3cm": [5, 8],
};

export const createSlabListingSchema = z
  .object({
    materialName: z
      .string()
      .min(2, "Material name must be at least 2 characters"),

    thickness: z.enum(["2cm", "3cm"]),

    slabsPerLot: z.coerce
      .number()
      .int("Slabs per lot must be a whole number")
      .positive("Slabs per lot must be greater than 0"),

    lengthMin: z.coerce
      .number()
      .min(100, "Length must be at least 100 cm")
      .max(140, "Length must be at most 140 cm"),

    lengthMax: z.coerce
      .number()
      .min(100, "Length must be at least 100 cm")
      .max(140, "Length must be at most 140 cm"),

    widthMin: z.coerce
      .number()
      .min(57, "Width must be at least 57 cm")
      .max(85, "Width must be at most 85 cm"),

    widthMax: z.coerce
      .number()
      .min(57, "Width must be at least 57 cm")
      .max(85, "Width must be at most 85 cm"),

    unitPrice: z.coerce.number().positive("Unit price must be greater than 0"),

    colorCategory: z.enum(["Dark", "Light", "White"]),

    veinPattern: z.enum(["Long", "Short"]),
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

export type CreateSlabListingInput = z.infer<typeof createSlabListingSchema>;
