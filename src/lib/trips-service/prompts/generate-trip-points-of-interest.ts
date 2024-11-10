import "server-only";

import { Trip, tripPointsOfInterestSchema } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { getSystemPrompt } from "./system-prompt";
import { z } from "zod";

export async function generateTripPointsOfInterest(props: { trip: Trip }) {
  const key = "result";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      getSystemPrompt({ trip: props.trip }),
      {
        role: "user",
        content: `
          List the main points of interest in ${props.trip.destination}.
          For each point of interest, include a title and a brief description.
          Consider the traveler’s preferences, which include ${props.trip.purpose}. 
          The trip will last ${props.trip.duration}. 
          Suggest landmarks, attractions, and unique experiences that match these preferences.
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
        tripPointsOfInterestSchema.pick({ title: true, description: true })
      ),
    }),
    responseProperty: key,
  });
  return result[key];
}
