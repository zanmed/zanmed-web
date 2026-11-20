import { z } from "zod";

export const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  count: z.coerce.number().int().min(0).default(0),
  image: z.string().min(1, "Image is required"),
  order: z.coerce.number().int().default(0),
});

export type IdeaInput = z.infer<typeof ideaSchema>;
