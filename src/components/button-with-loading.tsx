"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

type Props = React.PropsWithChildren<ButtonProps> & {
  fallback?: React.ReactNode;
};

export function ButtonWithLoading({ children, fallback, ...props }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
    ev.preventDefault();
    setIsLoading(true);
    props.onClick?.(ev);
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
