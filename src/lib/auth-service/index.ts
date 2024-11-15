import { redirect } from "next/navigation";
import { User } from "../user-service/types";
import { auth } from "@clerk/nextjs/server";
import { appConstants } from "@/app/constants";

async function getAuthSession(): Promise<User["id"] | undefined> {
  const session = await auth();
  if (!session.userId) return undefined;
  return session.userId;
}

async function requireAuthSession(): Promise<User["id"]> {
  const session = await getAuthSession();
  if (!session) return redirect(appConstants.UNAUTHENTICATED_REDIRECT_PATH);
  return session;
}

export function getAuthService() {
  return {
    getAuthSession,
    requireAuthSession,
  };
}
