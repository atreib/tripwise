import "server-only";

import { z } from "zod";

export async function getCurrentExchangeRate(props: {
  currencyCodeFrom: string;
  currencyCodeTo: string;
}) {
  const result = await fetch(
    `https://latest.currency-api.pages.dev/v1/currencies/${props.currencyCodeFrom.toLowerCase()}.json`
  );
  if (!result.ok) throw new Error("Failed to fetch exchange rate");
  const data = await result.json();
  const expectedSchema = z.object({
    [props.currencyCodeFrom.toLowerCase()]: z.object({
      [props.currencyCodeTo.toLowerCase()]: z.coerce.number(),
    }),
  });
  const parsedData = expectedSchema.parse(data);
  return parsedData[props.currencyCodeFrom.toLowerCase()][
    props.currencyCodeTo.toLowerCase()
  ];
}
