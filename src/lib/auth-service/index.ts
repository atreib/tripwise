import { redirect } from "next/navigation";
import { getMagicLinkUtil } from "./utils/magic-link";
import { getUserService } from "../user-service";
import * as cookieSessionUtils from "./utils/cookie-session";
import { User } from "../user-service/types";

const MAGIC_LINK_CALLBACK_PATH = "/api/auth/callback";
const UNAUTHENTICATED_REDIRECT_PATH = "/";
export const FREE_TIER_LIMIT = 50;
const FREE_TIER_FULL_MESSAGE =
  "Sorry, the free tier is full. Please upgrade to a paid plan to continue.";

async function sendMagicLink(email: string): Promise<void> {
  const user = await getUserService().getUserByEmail(email);
  const totalUsers = await getUserService().getTotalUsers();

  if (!user && totalUsers >= FREE_TIER_LIMIT) {
    throw new Error(FREE_TIER_FULL_MESSAGE);
  }

  const magicLinkToken = getMagicLinkUtil().generateMagicLinkToken({ email });
  const magicLinkUrl = `${MAGIC_LINK_CALLBACK_PATH}?token=${magicLinkToken}`;
  await getMagicLinkUtil().sendMagicLinkEmail(email, magicLinkUrl);
}

async function authenticateWithMagicLink(token: string): Promise<User> {
  const magicLink = getMagicLinkUtil().validateMagicLinkToken(token);
  if (!magicLink) return redirect(UNAUTHENTICATED_REDIRECT_PATH);
  const email = magicLink.email;
  let user = await getUserService().getUserByEmail(email);
  if (!user) {
    const totalUsers = await getUserService().getTotalUsers();
    if (totalUsers < FREE_TIER_LIMIT) {
      const name = email.split("@")[0];
      user = await getUserService().createUser({
        email,
        name,
        role: "beta",
      });
    }
  }

  if (!user)
    return redirect(
      `${UNAUTHENTICATED_REDIRECT_PATH}?message=${FREE_TIER_FULL_MESSAGE}`
    );

  await cookieSessionUtils.createSession({
    userId: user.id,
  });

  return user;
}

async function getAuthSession(): Promise<User["id"] | undefined> {
  const session = await cookieSessionUtils.getSession();
  if (!session) return undefined;
  return session.userId;
}

async function requireAuthSession(): Promise<User["id"]> {
  const session = await getAuthSession();
  if (!session) return redirect(UNAUTHENTICATED_REDIRECT_PATH);
  return session;
}

async function logout() {
  await cookieSessionUtils.destroySession();
  redirect(UNAUTHENTICATED_REDIRECT_PATH);
}

export function getAuthService() {
  return {
    sendMagicLink,
    authenticateWithMagicLink,
    getAuthSession,
    requireAuthSession,
    logout,
  };
}
