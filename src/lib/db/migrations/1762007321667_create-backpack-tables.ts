import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("backpack")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("userId", "varchar", (col) => col.notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()")
    )
    .execute();

  await db.schema
    .createTable("backpack_item")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("backpackId", "uuid", (col) =>
      col.references("backpack.id").onDelete("cascade").notNull()
    )
    .addColumn("item", "varchar", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("backpack_item").execute();
  await db.schema.dropTable("backpack").execute();
}
