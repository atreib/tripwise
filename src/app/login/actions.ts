"use server";

import { getAuthService } from "@/lib/auth-service";
import { unauthenticatedActionClient } from "@/lib/safe-actions";
import { z } from "zod";

export const signInAction = unauthenticatedActionClient
  .schema(z.object({ email: z.string().email() }))
  .action(async ({ parsedInput: { email } }) => {
    await getAuthService().sendMagicLink(email);
  });
