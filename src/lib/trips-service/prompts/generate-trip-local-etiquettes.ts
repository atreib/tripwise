import "server-only";

import { Trip, tripLocalEtiquetteSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";
import { z } from "zod";

export async function generateTripLocalEtiquettes(props: { trip: Trip }) {
  const key = "result";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `
          Provide some essential local tips and etiquette for visiting ${props.trip.destination}. 
          Include cultural dos and don’ts, greetings, tipping practices, 
          and any useful phrases or customs for interacting with locals. 
          Consider that this is a ${props.trip.purpose} trip, 
          and the traveler may visit popular attractions and local restaurants.
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
        tripLocalEtiquetteSchema.pick({ title: true, description: true })
      ),
    }),
    responseProperty: key,
  });
  return result[key];
}
