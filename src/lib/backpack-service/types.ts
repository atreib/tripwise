import { z } from "zod";

export const backpackSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1),
  created_at: z.coerce.date(),
});

export const backpackItemSchema = z.object({
  id: z.string().uuid(),
  backpackId: z.string().uuid(),
  item: z.string().min(1),
});

export type Backpack = z.infer<typeof backpackSchema>;
export type BackpackItem = z.infer<typeof backpackItemSchema>;
