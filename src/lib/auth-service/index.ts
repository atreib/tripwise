import { redirect } from "next/navigation";
import { getMagicLinkUtil } from "./utils/magic-link";
import { getUserService } from "../user-service";
import * as cookieSessionUtils from "./utils/cookie-session";
import { User } from "../user-service/types";

const MAGIC_LINK_CALLBACK_PATH = "/api/auth/callback";
const UNAUTHENTICATED_REDIRECT_PATH = "/";
const AUTHENTICATED_REDIRECT_PATH = "/dashboard";

async function sendMagicLink(email: string): Promise<void> {
  const magicLinkToken = getMagicLinkUtil().generateMagicLinkToken({ email });
  const magicLinkUrl = `${MAGIC_LINK_CALLBACK_PATH}?token=${magicLinkToken}`;
  getMagicLinkUtil().sendMagicLinkEmail(email, magicLinkUrl);
}

async function authenticateWithMagicLink(token: string): Promise<void> {
  const magicLink = getMagicLinkUtil().validateMagicLinkToken(token);
  if (!magicLink) return redirect(UNAUTHENTICATED_REDIRECT_PATH);

  const user = await getUserService().getUserByEmail(magicLink.email);
  if (!user) return redirect(UNAUTHENTICATED_REDIRECT_PATH);

  await cookieSessionUtils.createSession({
    userId: user.id,
  });
  redirect(AUTHENTICATED_REDIRECT_PATH);
}

async function getAuthSession(): Promise<User | undefined> {
  const session = await cookieSessionUtils.getSession();
  if (!session) return undefined;
  const user = await getUserService().getUserById(session.userId);
  if (!user) return undefined;
  return user;
}

async function requireAuthSession(): Promise<User> {
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
