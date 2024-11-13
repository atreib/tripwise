import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("feedback")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("userId", "uuid", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("message", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo("now()")
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("feedback").execute();
}
