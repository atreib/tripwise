"use server";

import { getBackpackService } from "@/lib/backpack-service";
import { authenticatedActionClient } from "@/lib/safe-actions";
import { backpackSchema, backpackItemSchema } from "@/lib/backpack-service/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export const deleteBackpackAction = authenticatedActionClient
  .schema(backpackSchema.pick({ id: true }))
  .action(async ({ parsedInput: { id } }) => {
    await getBackpackService().deleteBackpack({ backpackId: id });
    revalidatePath("/dashboard/backpacks");
  });

export const addItemAction = authenticatedActionClient
  .schema(backpackItemSchema.omit({ id: true }))
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
