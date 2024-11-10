import "server-only";

import { Trip, tripGeneratedSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";

export async function generateTripDailyCost(props: { trip: Trip }) {
  const key = "dailyCost";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `Using the local currency, what is the average daily cost I should expect to spend in my trip for one person?`,
      },
    ],
    schema: tripGeneratedSchema.pick({ [key]: true }),
    responseProperty: key,
  });
  return result[key];
}
