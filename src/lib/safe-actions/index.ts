import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { getAuthService } from "../auth-service";

export const unauthenticatedActionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return "Oh no, something went wrong!";
  },
});

export const authenticatedActionClient = unauthenticatedActionClient.use(
  async ({ next }) => {
    const user = await getAuthService().getAuthSession();
    if (!user) throw new Error("Unauthenticated");
    return next({ ctx: { user } });
  }
);
