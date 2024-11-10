"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

type Props = React.PropsWithChildren<ButtonProps> & {
  fallback?: React.ReactNode;
  disableLoading?: boolean;
};

export function ButtonWithLoading({
  children,
  fallback,
  disableLoading = false,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
    if (!disableLoading) setIsLoading(true);
    props.onClick?.(ev);
  }

  const finallFallback = fallback ? (
    fallback
  ) : (
    <div>
      <Loader2Icon className="h-4 w-4 animate-spin" /> {children}
    </div>
  );

  return (
    <Button {...props} onClick={handleClick} disabled={isLoading}>
      {isLoading ? finallFallback : children}
    </Button>
  );
}
