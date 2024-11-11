import "server-only";

import { Trip } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { z } from "zod";

export async function generateTranslation(props: {
  destination: Trip["destination"];
  text: string;
}) {
  const key = "translation";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      {
        role: "user",
        content: `How do I say "${props.text}" in the local language from ${props.destination}}?`,
      },
      {
        role: "system",
        content: `Just return the translated text.`,
      },
    ],
    schema: z.object({
      [key]: z.string(),
    }),
    responseProperty: key,
  });
  return result[key];
}
