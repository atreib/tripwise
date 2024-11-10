import "server-only";

import { Trip, tripGeneratedSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";

export async function generateTripCurrency(props: { trip: Trip }) {
  const key = "currency";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `What is the currency code for the local currency in ${props.trip.destination}}?`,
      },
    ],
    schema: tripGeneratedSchema.pick({ [key]: true }),
    responseProperty: key,
  });
  return result[key];
}
