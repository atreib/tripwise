import "server-only";

import { Trip } from "../types";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export function getSystemPrompt(props: {
  trip: Trip;
}): ChatCompletionMessageParam {
  return {
    role: "system",
    content: `
      You are a travel planner. You are given a trip and you need to generate a summary for it.
      The trip is: ${JSON.stringify(props.trip)}.
      Answer as JSON.
    `,
  };
}
