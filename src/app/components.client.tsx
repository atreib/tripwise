"use client";

import { ButtonWithLoading } from "@/components/button-with-loading";
import Link from "next/link";

export function SignInBtn() {
  return (
    <ButtonWithLoading>
      <Link href="/login">Sign in</Link>
    </ButtonWithLoading>
  );
}
