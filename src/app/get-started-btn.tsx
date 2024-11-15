import "server-only";

import { Button, ButtonProps } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { appConstants } from "./constants";
import { ButtonWithLoading } from "@/components/button-with-loading";

type Props = {
  variant?: ButtonProps["variant"];
  label?: string;
  whenSignedIn?: {
    useAvatarButton?: boolean;
  };
};

export async function GetStartedButton({
  variant = "default",
  label = "Get started",
  whenSignedIn,
}: Props) {
  return (
    <>
      <SignedOut>
        <SignInButton
          forceRedirectUrl={`${process.env.APP_URL}${appConstants.SIGN_UP_CALLBACK_PATH}`}
          signUpForceRedirectUrl={`${process.env.APP_URL}${appConstants.SIGN_UP_CALLBACK_PATH}`}
        >
          <Button variant={variant}>{label}</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        {whenSignedIn?.useAvatarButton ? (
          <UserButton />
        ) : (
          <ButtonWithLoading variant={variant} asChild>
            <Link href={appConstants.AUTHENTICATED_REDIRECT_PATH}>
              Go to your dashboard
            </Link>
          </ButtonWithLoading>
        )}
      </SignedIn>
    </>
  );
}
