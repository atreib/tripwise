"use server";

import { getFeedbackService } from "@/lib/feedback-service";
import { authenticatedBetaUserActionClient } from "@/lib/safe-actions";
import { z } from "zod";

export const sendFeedbackAction = authenticatedBetaUserActionClient
  .schema(z.object({ message: z.string().min(2).max(500) }))
  .action(async ({ parsedInput: { message }, ctx: { userId } }) => {
    return getFeedbackService().createdFeedback({ userId, message });
  });
