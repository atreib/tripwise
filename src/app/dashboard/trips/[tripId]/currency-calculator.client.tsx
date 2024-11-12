"use client";

import { Input } from "@/components/ui/input";
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

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        <p>{userLocalCurrencyCode}</p>
        <Input
          type="number"
          inputMode="decimal"
          value={amount.toString().replace(/^0+/, "")}
          onChange={(e) => setAmount(Number(e.target.value.replace(/^0+/, "")))}
          className="w-32"
        />
      </div>
      <div className="text-sm text-muted-foreground">is</div>
      <div className="flex gap-2 items-center">
        <p>{destinationLocalCurrencyCode}</p>
        <p>{(amount * exchangeRate).toFixed(2)}</p>
      </div>
    </div>
  );
}
