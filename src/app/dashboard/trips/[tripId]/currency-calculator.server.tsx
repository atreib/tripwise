import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTripsService } from "@/lib/trips-service";
import { TripGenerated } from "@/lib/trips-service/types";
import { CurrencyCalculatorField } from "./currency-calculator.client";

type Props = {
  userLocalCurrencyCode: string;
  destinationLocalCurrencyCode: TripGenerated["currency"];
};

export async function CurrencyCalculatorDialog({
  userLocalCurrencyCode,
  destinationLocalCurrencyCode,
  children,
}: React.PropsWithChildren<Props>) {
  const exchangeRate =
    await getTripsService().getDestinationCurrentExchangeRate({
      userLocalCurrencyCode,
      destinationLocalCurrencyCode,
    });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exchange Rate</DialogTitle>
          <DialogDescription>
            Quickly calculate the exchange rate between {userLocalCurrencyCode}{" "}
            and {destinationLocalCurrencyCode}
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <CurrencyCalculatorField
            exchangeRate={exchangeRate}
            userLocalCurrencyCode={userLocalCurrencyCode}
            destinationLocalCurrencyCode={destinationLocalCurrencyCode}
          />
          <aside className="text-sm text-muted-foreground">
            Current exchange rate: 1 {userLocalCurrencyCode} is{" "}
            {exchangeRate.toFixed(2)} {destinationLocalCurrencyCode}
          </aside>
        </section>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
