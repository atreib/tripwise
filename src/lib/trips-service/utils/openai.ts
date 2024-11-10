import "server-only";

import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

async function fetchOpenAI<T>(props: {
  model: string;
  chat: ChatCompletionMessageParam[];
  schema: z.ZodSchema<T>;
  responseProperty: string;
}) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: props.model,
      messages: props.chat,
      response_format: zodResponseFormat(props.schema, props.responseProperty),
    }),
  });
  const payload = await response.json();
  return props.schema.parse(JSON.parse(payload.choices.at(0)?.message.content));
}

export { fetchOpenAI };
