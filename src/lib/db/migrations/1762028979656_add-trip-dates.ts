import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema
		.alterTable('trip')
		.addColumn('departure_date', 'date')
		.execute();

	await db.schema
		.alterTable('trip')
		.addColumn('return_date', 'date')
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema
		.alterTable('trip')
		.dropColumn('return_date')
		.execute();

	await db.schema
		.alterTable('trip')
		.dropColumn('departure_date')
		.execute();
}
