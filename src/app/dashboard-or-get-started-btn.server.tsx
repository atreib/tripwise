import { Button, ButtonProps } from "@/components/ui/button";
import { getAuthService } from "@/lib/auth-service";
import Link from "next/link";
import { appConstants } from "./constants";
import { GetStartedButton } from "./get-started-btn.server";

type Props = {
  variant?: ButtonProps["variant"];
};

export async function DashboardOrGetStartedButton({ variant }: Props) {
  const user = await getAuthService().getAuthSession();

  if (user) {
    return (
      <Button asChild variant={variant}>
        <Link href={appConstants.AUTHENTICATED_REDIRECT_PATH}>
          Go to your dashboard
        </Link>
      </Button>
    );
  }

  return <GetStartedButton />;
}
