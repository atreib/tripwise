import "server-only";

import { Trip } from "../types";
import { fetchOpenAI } from "../utils/openai";
import { z } from "zod";

export async function generateTranslation(props: {
  destination: Trip["destination"];
  text: string;
  userLocalLanguageCode?: string;
}) {
  const key = "translation";
  const result = await fetchOpenAI({
    model: "gpt-4o-mini",
    chat: [
      {
        role: "system",
        content: `
          The user language is "${props.userLocalLanguageCode ?? "en-us"}".
          The user will send a message that may be written in his own language, or in the local language from ${
            props.destination
          }.
          If the message is already in the local language from ${
            props.destination
          }, translate it to the user's language.
          If the message is not in the local language from ${
            props.destination
          }, translate it to the local language from ${props.destination}.
        `,
      },
      {
        role: "user",
        content: `Translate "${props.text}" for me.`,
      },
      {
        role: "system",
        content: `Return only the translated text.`,
      },
    ],
    schema: z.object({
      [key]: z.string(),
    }),
    responseProperty: key,
  });
  return result[key];
}
