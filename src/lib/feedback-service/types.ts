import { z } from "zod";

export const feedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
  createdAt: z.coerce.date(),
});
export type Feedback = z.infer<typeof feedbackSchema>;
