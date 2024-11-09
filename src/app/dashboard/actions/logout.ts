"use server";

import { getAuthService } from "@/lib/auth-service";
import { authenticatedActionClient } from "@/lib/safe-actions";

export const logoutAction = authenticatedActionClient.action(async () =>
  getAuthService().logout()
);
