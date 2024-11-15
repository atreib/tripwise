import "server-only";

import { User, userSchema } from "./types";
import { db } from "@/lib/db";
import { v4 } from "uuid";
import { appConstants } from "@/app/constants";
import { redirect } from "next/navigation";

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

async function requireUserById(id: string): Promise<User> {
  const user = await getUserById(id);
  if (!user) return redirect(appConstants.UNAUTHENTICATED_REDIRECT_PATH);
  return user;
}

async function createUser(
  user: Omit<User, "id"> & Partial<Pick<User, "id">>
): Promise<User> {
  const newUser = await db
    .insertInto("user")
    .values({
      ...user,
      id: user.id ?? v4(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  return userSchema.parse(newUser);
}

async function updateUser(
  id: User["id"],
  attrs: Partial<Omit<User, "id">>
): Promise<User> {
  const updatedUser = await db
    .updateTable("user")
    .set(attrs)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
  return userSchema.parse(updatedUser);
}

async function changeUserId(
  oldId: User["id"],
  newId: User["id"]
): Promise<void> {
  await db
    .updateTable("user")
    .set({ id: newId })
    .where("id", "=", oldId)
    .execute();
}

async function getTotalUsers(): Promise<number> {
  const totalUsers = await db
    .selectFrom("user")
    .select(({ fn }) => [fn.count<number>("user.id").as("users_count")])
    .executeTakeFirstOrThrow();
  return totalUsers.users_count;
}

async function requireBetaAccess(userId: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user || !["beta", "staff"].includes(user.role))
    return redirect(appConstants.AUTHENTICATED_REDIRECT_PATH);
  return user;
}

export function getUserService() {
  return {
    requireUserById,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    getTotalUsers,
    requireBetaAccess,
    changeUserId,
  };
}
