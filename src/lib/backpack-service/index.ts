import "server-only";

import { db } from "@/lib/db";
import { Backpack, backpackSchema, backpackItemSchema } from "./types";
import { v4 } from "uuid";

async function createBackpack(props: { backpack: Omit<Backpack, "id" | "created_at"> }) {
  const newBackpack = await db
    .insertInto("backpack")
    .values({
      ...props.backpack,
      id: v4(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return backpackSchema.parse(newBackpack);
}

async function getBackpackById(props: { backpackId: string }) {
  const backpack = await db
    .selectFrom("backpack")
    .selectAll()
    .where("id", "=", props.backpackId)
    .executeTakeFirst();
  if (!backpack) return undefined;
  return backpackSchema.parse(backpack);
}

async function getBackpacksByUserId(props: { userId: string }) {
  const backpacks = await db
    .selectFrom("backpack")
    .selectAll()
    .where("userId", "=", props.userId)
    .orderBy("created_at", "desc")
    .execute();
  return backpackSchema.array().parse(backpacks);
}

async function deleteBackpack(props: { backpackId: string }) {
  await db.deleteFrom("backpack").where("id", "=", props.backpackId).execute();
}

async function getBackpackItems(props: { backpackId: string }) {
  const items = await db
    .selectFrom("backpack_item")
    .selectAll()
    .where("backpackId", "=", props.backpackId)
    .execute();
  return backpackItemSchema.array().parse(items);
}

async function addItem(props: { backpackId: string; item: string }) {
  const newItem = await db
    .insertInto("backpack_item")
    .values({
      id: v4(),
      backpackId: props.backpackId,
      item: props.item,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return backpackItemSchema.parse(newItem);
}

async function updateItem(props: { itemId: string; item: string }) {
  const updatedItem = await db
    .updateTable("backpack_item")
    .set({ item: props.item })
    .where("id", "=", props.itemId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return backpackItemSchema.parse(updatedItem);
}

async function deleteItem(props: { itemId: string }) {
  await db
    .deleteFrom("backpack_item")
    .where("id", "=", props.itemId)
    .execute();
}

export function getBackpackService() {
  return {
    createBackpack,
    getBackpackById,
    getBackpacksByUserId,
    deleteBackpack,
    getBackpackItems,
    addItem,
    updateItem,
    deleteItem,
  };
}
