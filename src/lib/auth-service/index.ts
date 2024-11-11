import { redirect } from "next/navigation";
import { getMagicLinkUtil } from "./utils/magic-link";
import { getUserService } from "../user-service";
import * as cookieSessionUtils from "./utils/cookie-session";
import { User } from "../user-service/types";

const MAGIC_LINK_CALLBACK_PATH = "/api/auth/callback";
const UNAUTHENTICATED_REDIRECT_PATH = "/";

async function sendMagicLink(email: string): Promise<void> {
  const magicLinkToken = getMagicLinkUtil().generateMagicLinkToken({ email });
  const magicLinkUrl = `${MAGIC_LINK_CALLBACK_PATH}?token=${magicLinkToken}`;
  await getMagicLinkUtil().sendMagicLinkEmail(email, magicLinkUrl);
}

async function authenticateWithMagicLink(token: string): Promise<void> {
  const magicLink = getMagicLinkUtil().validateMagicLinkToken(token);
  if (!magicLink) return redirect(UNAUTHENTICATED_REDIRECT_PATH);
  const email = magicLink.email;
  let user = await getUserService().getUserByEmail(email);
  if (!user) {
    const name = email.split("@")[0];
    user = await getUserService().createUser({
      email,
      name,
    });
  }
  await cookieSessionUtils.createSession({
    userId: user.id,
  });
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
