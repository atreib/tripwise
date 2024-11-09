import "server-only";

import jwt from "jsonwebtoken";
import { MagicLinkClaims } from "../types";

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
  console.log("Sending magic link email to", email, "with URL", magicLinkUrl);
}

export function getMagicLinkUtil() {
  return {
    generateMagicLinkToken,
    validateMagicLinkToken,
    sendMagicLinkEmail,
  };
}
