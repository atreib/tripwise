"use server";

import { authenticatedActionClient } from "@/lib/safe-actions";

export const expectedToFailAction = authenticatedActionClient.action(
  async () => {
    return "Hello, world!";
  }
);
