import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { appConstants } from "./constants";

type Props = {
  variant?: ButtonProps["variant"];
  label?: string;
};

export function GetStartedButton({ variant, label }: Props) {
  return (
    <Button asChild variant={variant}>
      <Link href={appConstants.LOGIN_PATH}>{label}</Link>
    </Button>
  );
}
