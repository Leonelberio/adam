import { z } from "zod";

export const cardSchema = z.object({
  content: z.string().min(5, "Content must be at least 5 characters long"),
  creatorId: z.string(),
  countryId: z.string(),
  categoryId: z.string().optional(),
  positionX: z.number().default(0),
  positionY: z.number().default(0),
});

export const updateCardSchema = z.object({
  content: z.string().min(5, "Content must be at least 5 characters long"),
  categoryId: z.string().optional(),
  positionX: z.number(),
  positionY: z.number(),
});

export type Card = z.infer<typeof cardSchema>;
export type UpdateCard = z.infer<typeof updateCardSchema>;
