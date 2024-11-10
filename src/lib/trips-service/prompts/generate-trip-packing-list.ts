import "server-only";

import { Trip, tripPackingListSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";
import { z } from "zod";

export async function generateTripPackingList(props: { trip: Trip }) {
  const key = "result";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `
          Create a packing checklist for a trip to ${props.trip.destination} 
          during ${props.trip.season}. 
          The trip will last ${props.trip.duration}, 
          and the trip purpose is ${props.trip.purpose}. 
          Include items for specific activities and weather, 
          as well as general travel essentials.
          Do not format the response as markdown, neither group the items.
          Just a plain list of items.
        `,
      },
    ],
    schema: z.object({
      [key]: z.array(tripPackingListSchema.shape.item),
    }),
    responseProperty: key,
  });
  return result[key];
}
