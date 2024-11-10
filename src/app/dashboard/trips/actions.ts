"use server";

import { getTripsService } from "@/lib/trips-service";
import { authenticatedActionClient } from "@/lib/safe-actions";
import { tripSchema } from "@/lib/trips-service/types";
import { revalidatePath } from "next/cache";

export const createTripAction = authenticatedActionClient
  .schema(tripSchema.omit({ id: true, created_at: true, userId: true }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    return getTripsService().createTrip({
      trip: {
        ...parsedInput,
        userId: user.id,
      },
    });
  });

export const deleteTripAction = authenticatedActionClient
  .schema(tripSchema.pick({ id: true }))
  .action(async ({ parsedInput: { id } }) => {
    await getTripsService().deleteTrip({ tripId: id });
    revalidatePath("/dashboard/trips");
  });
