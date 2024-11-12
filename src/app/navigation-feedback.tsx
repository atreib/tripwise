"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavigationFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);

    const onPageLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [pathname, searchParams]);

  return (
    <div
      className={cn(
        "fixed w-full top-0 left-0 h-1 pointer-events-none overflow-hidden z-50 bg-orange-300",
        isLoading ? "animate-pulse-left-right" : "opacity-0"
      )}
    >
      <div
        className={`w-full h-full bg-gradient-to-r from-orange-200 via-orange-500 to-orange-200 transition-all duration-[5000ms] ease-in-out`}
      >
        &nbsp;
      </div>
    </div>
  );
}
