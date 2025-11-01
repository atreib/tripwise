import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("trip_backpack_item")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("item", "varchar", (col) => col.notNull())
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("packed", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("trip_backpack_item").execute();
}
