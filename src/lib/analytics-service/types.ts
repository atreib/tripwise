import { z } from "zod";
import { userSchema } from "../user-service/types";

export const identifyCallSchema = z.object({
  userId: userSchema.shape.id,
  properties: z.record(z.string()),
});
export type IdentifyCall = z.output<typeof identifyCallSchema>;
