import { Button, ButtonProps } from "@/components/ui/button";
import { getAuthService } from "@/lib/auth-service";
import Link from "next/link";
import { appConstants } from "./constants";

type Props = {
  variant?: ButtonProps["variant"];
};

export async function CtaButton({ variant }: Props) {
  const user = await getAuthService().getAuthSession();

  const ctaUrl = user
    ? appConstants.AUTHENTICATED_REDIRECT_PATH
    : appConstants.LOGIN_PATH;
  const ctaText = user ? "Dashboard" : "Get Started";

  return (
    <Button asChild variant={variant}>
      <Link href={ctaUrl}>{ctaText}</Link>
    </Button>
  );
}
