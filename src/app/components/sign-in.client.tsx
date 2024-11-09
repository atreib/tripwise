"use client";

import { Button } from "@/components/ui/button";
import { signInAction } from "../actions/sign-in";

export function SignIn() {
  async function handleSignIn() {
    const result = await signInAction({ email: "test@test.com" });

    // TODO: Handle errors on UI
    if (result?.validationErrors) {
      console.error(result.validationErrors);
    }
    if (result?.bindArgsValidationErrors) {
      console.error(result.bindArgsValidationErrors);
    }
    if (result?.serverError) {
      console.error(result.serverError);
    }
  }

  return <Button onClick={handleSignIn}>Sign in</Button>;
}
