"use client";

import { useEffect } from "react";
import { IdentifyCall } from "../types";
import { usePostHog } from "posthog-js/react";

type Props = {
  userId?: IdentifyCall["userId"];
};

export function IdentifyUser({ userId }: Props) {
  const posthog = usePostHog();
  const key = "identified";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userId && window.localStorage.getItem(key) !== userId) {
      posthog.identify(userId);
      window.localStorage.setItem(key, userId);
      return;
    }
  }, [userId, posthog]);

  return null;
}
