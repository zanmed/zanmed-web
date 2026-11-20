import { z } from "zod";

export const collectionSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(2000).optional().or(z.literal("")),
  coverImage: z.string().max(500).optional().or(z.literal("")),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
