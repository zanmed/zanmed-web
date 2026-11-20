import { z } from "zod";

export const whatsAppOrderCreateSchema = z.object({
  customerName: z.string().max(200).optional().or(z.literal("")),
  customerPhone: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required"),
  source: z.enum(["PRODUCT_PAGE", "CART", "QUICK_BUY"]).default("PRODUCT_PAGE"),
});

export const whatsAppOrderStatusSchema = z.object({
  status: z.enum([
    "CLICKED",
    "CONTACTED",
    "CONFIRMED",
    "FULFILLED",
    "CANCELLED",
  ]),
  customerName: z.string().max(120).optional().or(z.literal("")),
  customerPhone: z.string().max(40).optional().or(z.literal("")),
});

export type WhatsAppOrderStatusInput = z.infer<
  typeof whatsAppOrderStatusSchema
>;

export type WhatsAppOrderCreateInput = z.infer<
  typeof whatsAppOrderCreateSchema
>;
