import "server-only";

import jwt from "jsonwebtoken";
import { MagicLinkClaims } from "../types";
import { sendEmail } from "@/lib/email";
import { MagicLinkTemplate } from "@/lib/email/templates/login-magic-link";
import { appConstants } from "@/app/constants";

const SECRET_KEY = process.env.MAGIC_LINK_SECRET_KEY! as string;

function generateMagicLinkToken(claims: MagicLinkClaims): string {
  return jwt.sign(claims, SECRET_KEY, { expiresIn: "5m" });
}

function validateMagicLinkToken(token: string): MagicLinkClaims | undefined {
  try {
    const claims = jwt.verify(token, SECRET_KEY) as MagicLinkClaims;
    return claims;
  } catch (error) {
    console.error("Magic Link verification failed:", (error as Error).message);
    return undefined;
  }
}

function sendMagicLinkEmail(email: string, magicLinkUrl: string) {
  try {
    const url = `${process.env.APP_URL}${magicLinkUrl}`;
    return sendEmail({
      to: email,
      subject: `Your access to ${appConstants.APP_NAME}`,
      content: <MagicLinkTemplate name={email} url={url} />,
    });
  } catch (err) {
    console.error(`Could not send magic link email to ${email} because: `, err);
    throw err;
  }
}

export function getMagicLinkUtil() {
  return {
    generateMagicLinkToken,
    validateMagicLinkToken,
    sendMagicLinkEmail,
  };
}
