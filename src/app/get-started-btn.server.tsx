import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { appConstants } from "./constants";

type Props = {
  variant?: ButtonProps["variant"];
};

export function GetStartedButton({ variant }: Props) {
  return (
    <Button asChild variant={variant}>
      <Link href={appConstants.LOGIN_PATH}>Plan your next trip</Link>
    </Button>
  );
}
