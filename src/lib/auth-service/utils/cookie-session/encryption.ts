import "server-only";

import jwt from "jsonwebtoken";
import { Session } from "./types";

export function generateToken(session: Session): string {
  return jwt.sign(session, process.env.AUTH_SECRET_KEY!, {
    expiresIn: "1 day",
  });
}

export function validateToken(token: string): Session | undefined {
  try {
    const session = jwt.verify(token, process.env.AUTH_SECRET_KEY!) as Session;
    return session;
  } catch (error) {
    console.error("Token verification failed:", (error as Error).message);
    return undefined;
  }
}
