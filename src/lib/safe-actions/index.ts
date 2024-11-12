import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { getAuthService } from "../auth-service";

export const unauthenticatedActionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return e.message;
  },
});

export const authenticatedActionClient = unauthenticatedActionClient.use(
  async ({ next }) => {
    const userId = await getAuthService().getAuthSession();
    if (!userId) throw new Error("Unauthenticated");
    return next({ ctx: { userId } });
  }
);
