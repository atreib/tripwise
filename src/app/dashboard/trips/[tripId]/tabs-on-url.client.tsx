"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";

type Props = {
  defaultValue: "packing" | "etiquettes" | "food" | "attractions";
};

export function TabsOnUrl({
  children,
  defaultValue,
}: React.PropsWithChildren<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize tab from URL or fallback to defaultValue
  const [currentTab, setCurrentTab] = React.useState(() =>
    searchParams.get("tab") || defaultValue
  );

  const createQueryString = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      return params.toString();
    },
    [searchParams]
  );

  function handleTabChange(tab: string) {
    setCurrentTab(tab);
    router.push(pathname + "?" + createQueryString(tab), { scroll: false });
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="w-full overflow-auto"
    >
      {children}
    </Tabs>
  );
}
