import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("trip")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("userId", "uuid", (col) => col.notNull())
    .addColumn("destination", "varchar", (col) => col.notNull())
    .addColumn("season", "varchar", (col) => col.notNull())
    .addColumn("budget", "varchar", (col) => col.notNull())
    .addColumn("purpose", "varchar", (col) => col.notNull())
    .addColumn("duration", "varchar", (col) => col.notNull())
    .addColumn("summary", "text")
    .addColumn("currency", "varchar")
    .addColumn("dailyCost", "integer")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()")
    )
    .execute();

  await db.schema
    .createTable("trip_packing_list")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("item", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("trip_documents")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("document", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("trip_local_etiquette")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text")
    .execute();

  await db.schema
    .createTable("trip_local_food")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text")
    .execute();

  await db.schema
    .createTable("trip_points_of_interest")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("tripId", "uuid", (col) =>
      col.references("trip.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text")
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("trip_points_of_interest").execute();
  await db.schema.dropTable("trip_local_food").execute();
  await db.schema.dropTable("trip_local_etiquette").execute();
  await db.schema.dropTable("trip_documents").execute();
  await db.schema.dropTable("trip_packing_list").execute();
  await db.schema.dropTable("trip").execute();
  await db.schema.dropTable("user").execute();
}
