import "server-only";

import { PostHog } from "posthog-node";
import { IdentifyCall } from "./types";

export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

async function identify(props: IdentifyCall) {
  const posthog = PostHogClient();
  posthog.identify({
    distinctId: props.userId,
    properties: props.properties,
  });
}

export function getAnalyticsService() {
  return {
    identify,
  };
}
