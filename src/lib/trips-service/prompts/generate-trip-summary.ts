import "server-only";

import { Trip, tripGeneratedSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";

export async function generateTripSummary(props: { trip: Trip }) {
  const key = "summary";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `Write a uplifting summary about the trip.`,
      },
    ],
    schema: tripGeneratedSchema.pick({ [key]: true }),
    responseProperty: key,
  });
  return result[key];
}
