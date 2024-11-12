import { Button, ButtonProps } from "@/components/ui/button";

type Props = {
  variant?: ButtonProps["variant"];
};

export function CtaButtonSkeleton({ variant }: Props) {
  return (
    <Button variant={variant} disabled={true} className="animate-pulse">
      Get Started
    </Button>
  );
}
