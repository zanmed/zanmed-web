import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be at least 1")
    .max(99),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
