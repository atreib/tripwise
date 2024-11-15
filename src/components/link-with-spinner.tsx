"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/link";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface EnhancedLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function LinkWithSpinner({
  children,
  className,
  icon,
  disabled,
  ...props
}: EnhancedLinkProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    setIsLoading(false);
  }, [disabled]);

  const handleClick = () => {
    if (disabled) return;
    setIsLoading(true);
  };

  return (
    <Link
      {...props}
      href={props.href.toString()}
      className={cn("flex items-center space-x-2", className)}
      onClick={handleClick}
    >
      {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </Link>
  );
}
