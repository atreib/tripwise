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
    await props.onClick?.(ev);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  const finallFallback = fallback ? (
    fallback
  ) : (
    <>
      <Loader2Icon className="h-4 w-4 animate-spin" /> {children}
    </>
  );

  return (
    <Button {...props} onClick={handleClick} disabled={isLoading}>
      {isLoading ? finallFallback : children}
    </Button>
  );
}
