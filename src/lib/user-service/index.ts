import "server-only";

import { User, userSchema } from "./types";
import { db } from "@/lib/db";
import { v4 } from "uuid";

async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
  if (!user) return undefined;
  return userSchema.parse(user);
}

async function getUserById(id: string): Promise<User | undefined> {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  if (!user) return undefined;
  return userSchema.parse(user);
}

async function createUser(user: Omit<User, "id">): Promise<User> {
  const newUser = await db
    .insertInto("user")
    .values({
      ...user,
      id: v4(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  return userSchema.parse(newUser);
}

export function getUserService() {
  return {
    getUserByEmail,
    getUserById,
    createUser,
  };
}
