import { z } from "zod";
import { PRODUCT_CONDITIONS } from "../product-condition";

export const productSpecSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.coerce.number().int().default(0),
});

const optionalWholeNumber = (message: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.coerce.number().int("Use a whole number").positive(message).nullable(),
  );

export const productSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and hyphens only",
      ),
    name: z.string().min(1, "Name is required").max(200),
    shortDescription: z.string().max(900),
    description: z.string().min(1, "Description is required"),
    price: optionalWholeNumber("Price must be greater than 0"),
    compareAtPrice: optionalWholeNumber(
      "Compare-at price must be greater than 0",
    ),
    image: z.string().min(1, "Image is required"),
    gallery: z.array(z.string()).default([]),
    featured: z.coerce.boolean().default(false),
    inStock: z.coerce.boolean().default(true),
    condition: z.enum(PRODUCT_CONDITIONS).default("NEW"),
    categoryId: z.string().min(1, "Category is required"),
    collectionIds: z.array(z.string()).default([]),
    specs: z.array(productSpecSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.compareAtPrice === null) return;

    if (data.price === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Set a price before adding a compare-at price",
      });
    } else if (data.compareAtPrice <= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Compare-at price must be greater than the price",
      });
    }
  });

export type ProductInput = z.infer<typeof productSchema>;
