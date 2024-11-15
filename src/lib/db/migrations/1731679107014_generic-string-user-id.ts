import type { Kysely } from "kysely";
import type { Database } from "../types";

async function changeUserIdType(table: string, db: Kysely<Database>) {
  await db.schema
    .alterTable(table)
    .dropConstraint(`${table}_userId_fkey`)
    .ifExists()
    .execute();

  await db.schema
    .alterTable(table)
    .alterColumn("userId", (col) => col.setDataType("text"))
    .execute();
}

async function addUserIdConstraint(table: string, db: Kysely<Database>) {
  await db.schema
    .alterTable(table)
    .addForeignKeyConstraint(`${table}_userId_fkey`, ["userId"], "user", ["id"])
    .onDelete("cascade")
    .onUpdate("cascade")
    .execute();
}

export async function up(db: Kysely<Database>): Promise<void> {
  await changeUserIdType("feedback", db);
  await changeUserIdType("trip", db);

  await db.schema
    .alterTable("user")
    .alterColumn("id", (col) => col.setDataType("text"))
    .execute();

  await addUserIdConstraint("feedback", db);
  await addUserIdConstraint("trip", db);
}

export async function down(): Promise<void> {
  // no-op
}
