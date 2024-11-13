"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRightIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  exchangeRate: number;
  userLocalCurrencyCode: string;
  destinationLocalCurrencyCode: string;
};

export function CurrencyCalculatorField({
  exchangeRate,
  userLocalCurrencyCode,
  destinationLocalCurrencyCode,
}: Props) {
  const [amount, setAmount] = useState<number>(0);

  const [from, setFrom] = useState(userLocalCurrencyCode);
  const [to, setTo] = useState(destinationLocalCurrencyCode);

  function calculateResult() {
    if (from === userLocalCurrencyCode) {
      return (amount * exchangeRate).toFixed(2);
    }
    return (amount / exchangeRate).toFixed(2);
  }

  function swapCurrencies() {
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  }

  return (
    <div className="mt-4 flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        <p>{from}</p>
        <Input
          type="number"
          inputMode="decimal"
          value={amount.toString().replace(/^0+/, "")}
          onChange={(e) => setAmount(Number(e.target.value.replace(/^0+/, "")))}
          className="w-32"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        <Button variant="ghost" size="icon" onClick={swapCurrencies}>
          <ArrowLeftRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <p>{to}</p>
        <p>{calculateResult()}</p>
      </div>
    </div>
  );
}
