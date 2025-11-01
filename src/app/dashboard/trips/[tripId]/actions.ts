"use server";

import { getTripsService } from "@/lib/trips-service";
import { authenticatedActionClient } from "@/lib/safe-actions";
import { tripSchema, tripBackpackItemSchema } from "@/lib/trips-service/types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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

// Trip Backpack Actions
export const createTripBackpackFromBackpackAction = authenticatedActionClient
  .schema(
    z.object({
      tripId: z.string().uuid(),
      backpackId: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput }) => {
    await getTripsService().createTripBackpackFromBackpack({
      tripId: parsedInput.tripId,
      backpackId: parsedInput.backpackId,
    });
    revalidatePath(`/dashboard/trips/${parsedInput.tripId}`);
  });

export const createEmptyTripBackpackAction = authenticatedActionClient
  .schema(
    z.object({
      tripId: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput }) => {
    await getTripsService().createEmptyTripBackpack({
      tripId: parsedInput.tripId,
    });
    revalidatePath(`/dashboard/trips/${parsedInput.tripId}`);
  });

export const addTripBackpackItemAction = authenticatedActionClient
  .schema(tripBackpackItemSchema.omit({ id: true, order: true, packed: true }))
  .action(async ({ parsedInput }) => {
    const newItem = await getTripsService().addTripBackpackItem({
      tripId: parsedInput.tripId,
      item: parsedInput.item,
    });
    revalidatePath(`/dashboard/trips/${parsedInput.tripId}`);
    return newItem;
  });

export const updateTripBackpackItemAction = authenticatedActionClient
  .schema(tripBackpackItemSchema.pick({ id: true, item: true }))
  .action(async ({ parsedInput }) => {
    const updatedItem = await getTripsService().updateTripBackpackItem({
      itemId: parsedInput.id,
      item: parsedInput.item,
    });
    return updatedItem;
  });

export const deleteTripBackpackItemAction = authenticatedActionClient
  .schema(tripBackpackItemSchema.pick({ id: true }))
  .action(async ({ parsedInput: { id } }) => {
    await getTripsService().deleteTripBackpackItem({ itemId: id });
  });

export const reorderTripBackpackItemsAction = authenticatedActionClient
  .schema(
    z.object({
      tripId: z.string().uuid(),
      items: z.array(
        z.object({
          id: z.string().uuid(),
          order: z.number().int().min(0),
        })
      ),
    })
  )
  .action(async ({ parsedInput }) => {
    await getTripsService().reorderTripBackpackItems({
      items: parsedInput.items,
    });
    revalidatePath(`/dashboard/trips/${parsedInput.tripId}`);
  });

export const togglePackedAction = authenticatedActionClient
  .schema(tripBackpackItemSchema.pick({ id: true, packed: true }))
  .action(async ({ parsedInput }) => {
    const updatedItem = await getTripsService().toggleTripBackpackItemPacked({
      itemId: parsedInput.id,
      packed: parsedInput.packed,
    });
    return updatedItem;
  });
