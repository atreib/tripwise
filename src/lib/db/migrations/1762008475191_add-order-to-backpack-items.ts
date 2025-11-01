import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
  // Add order column with default value of 0
  await db.schema
    .alterTable("backpack_item")
    .addColumn("order", "integer", (col) => col.notNull().defaultTo(0))
    .execute();

  // Update existing items to have sequential order based on their ID
  // This ensures existing items have proper ordering
  const items = await db
    .selectFrom("backpack_item")
    .select(["id", "backpackId"])
    .orderBy("id")
    .execute();

  // Group items by backpackId and assign order within each backpack
  const backpackGroups = new Map<string, typeof items>();
  for (const item of items) {
    if (!backpackGroups.has(item.backpackId)) {
      backpackGroups.set(item.backpackId, []);
    }
    backpackGroups.get(item.backpackId)!.push(item);
  }

  // Update each item with its order
  for (const backpackItems of backpackGroups.values()) {
    for (let i = 0; i < backpackItems.length; i++) {
      await db
        .updateTable("backpack_item")
        .set({ order: i })
        .where("id", "=", backpackItems[i].id)
        .execute();
    }
  }
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable("backpack_item").dropColumn("order").execute();
}
