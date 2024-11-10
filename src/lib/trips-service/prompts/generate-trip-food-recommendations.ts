import "server-only";

import { Trip, tripLocalFoodSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";
import { z } from "zod";

export async function generateTripFoodRecommendations(props: { trip: Trip }) {
  const key = "result";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `
          Suggest some popular local dishes and dining tips for a visitor in ${props.trip.destination}. 
          Include must-try foods, drinks, and any unique dining customs or etiquette. 
        `,
      },
      {
        role: "system",
        content: `
          Do not format the response as markdown, neither group the items.
          Just a plain list of items.
        `,
      },
    ],
    schema: z.object({
      [key]: z.array(
        tripLocalFoodSchema.pick({ title: true, description: true })
      ),
    }),
    responseProperty: key,
  });
  return result[key];
}
