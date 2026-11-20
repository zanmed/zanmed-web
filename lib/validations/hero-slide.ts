import { z } from "zod";

export const heroSlideSchema = z.object({
  eyebrow: z.string().min(1, "Eyebrow is required"),
  title: z.string().min(1, "Title is required"),
  accent: z.string().min(1, "Accent is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  href: z.string().min(1, "Link is required"),
  pillTop: z.string().min(1, "Pill top text is required"),
  pillBottom: z.string().min(1, "Pill bottom text is required"),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
