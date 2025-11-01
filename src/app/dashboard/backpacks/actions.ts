"use server";

import { getBackpackService } from "@/lib/backpack-service";
import { authenticatedActionClient } from "@/lib/safe-actions";
import { backpackSchema, backpackItemSchema } from "@/lib/backpack-service/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createBackpackAction = authenticatedActionClient
  .schema(backpackSchema.omit({ id: true, created_at: true, userId: true }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const createdBackpack = await getBackpackService().createBackpack({
      backpack: {
        ...parsedInput,
        userId,
      },
    });
    revalidatePath("/dashboard/backpacks");
    redirect(`/dashboard/backpacks/${createdBackpack.id}`);
    return createdBackpack;
  });

export const updateBackpackAction = authenticatedActionClient
  .schema(backpackSchema.pick({ id: true, name: true }))
  .action(async ({ parsedInput: { id, name } }) => {
    const updatedBackpack = await getBackpackService().updateBackpack({
      backpackId: id,
      name,
    });
    revalidatePath(`/dashboard/backpacks/${id}`);
    revalidatePath("/dashboard/backpacks");
    return updatedBackpack;
  });

export const deleteBackpackAction = authenticatedActionClient
  .schema(backpackSchema.pick({ id: true }))
  .action(async ({ parsedInput: { id } }) => {
    await getBackpackService().deleteBackpack({ backpackId: id });
    revalidatePath("/dashboard/backpacks");
  });

export const addItemAction = authenticatedActionClient
  .schema(backpackItemSchema.omit({ id: true, order: true }))
  .action(async ({ parsedInput }) => {
    const newItem = await getBackpackService().addItem({
      backpackId: parsedInput.backpackId,
      item: parsedInput.item,
    });
    revalidatePath(`/dashboard/backpacks/${parsedInput.backpackId}`);
    return newItem;
  });

export const updateItemAction = authenticatedActionClient
  .schema(backpackItemSchema.pick({ id: true, item: true }))
  .action(async ({ parsedInput }) => {
    const updatedItem = await getBackpackService().updateItem({
      itemId: parsedInput.id,
      item: parsedInput.item,
    });
    return updatedItem;
  });

export const deleteItemAction = authenticatedActionClient
  .schema(backpackItemSchema.pick({ id: true }))
  .action(async ({ parsedInput: { id } }) => {
    await getBackpackService().deleteItem({ itemId: id });
  });

export const reorderItemsAction = authenticatedActionClient
  .schema(
    z.object({
      backpackId: z.string().uuid(),
      items: z.array(
        z.object({
          id: z.string().uuid(),
          order: z.number().int().min(0),
        })
      ),
    })
  )
  .action(async ({ parsedInput }) => {
    await getBackpackService().reorderItems({ items: parsedInput.items });
    revalidatePath(`/dashboard/backpacks/${parsedInput.backpackId}`);
  });
