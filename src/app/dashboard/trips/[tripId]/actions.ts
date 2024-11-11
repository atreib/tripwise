"use server";

import { getTripsService } from "@/lib/trips-service";
import { authenticatedActionClient } from "@/lib/safe-actions";
import { tripSchema } from "@/lib/trips-service/types";
import { z } from "zod";

export const translateTextAction = authenticatedActionClient
  .schema(
    z.object({
      destination: tripSchema.shape.destination,
      text: z.string().max(200),
    })
  )
  .action(async ({ parsedInput }) => {
    return getTripsService().translateText(parsedInput);
  });
