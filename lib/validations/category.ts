import { z } from "zod";

export const categorySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),
  name: z.string().min(1, "Name is required").max(120),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  icon: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true),
  parentId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
});

export type CategoryInput = z.infer<typeof categorySchema>;
