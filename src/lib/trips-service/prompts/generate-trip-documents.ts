import "server-only";

import { Trip, tripDocumentsSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";
import { z } from "zod";

export async function generateTripDocuments(props: { trip: Trip }) {
  const key = "result";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `
          List the essential travel documents and entry requirements 
          for a traveler going to ${props.trip.destination}. 
          Include visa requirements, health or vaccination documentation, 
          currency tips, and any important legal requirements or advisories. 
          Consider that the trip will take place in ${props.trip.season}.
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
      [key]: z.array(tripDocumentsSchema.pick({ document: true })),
    }),
    responseProperty: key,
  });
  return result[key];
}
