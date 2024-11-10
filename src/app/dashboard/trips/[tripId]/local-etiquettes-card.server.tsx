import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAuthService } from "@/lib/auth-service";
import { Trip } from "@/lib/trips-service/types";
import { getTripsService } from "@/lib/trips-service";

type Props = {
  trip: Trip;
};

export async function LocalEtiquettesCard({ trip }: Props) {
  await getAuthService().requireAuthSession();

  const localEtiquettes = await getTripsService().getTripLocalEtiquettes({
    tripId: trip.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Etiquettes and Tips</CardTitle>
        <CardDescription>
          Respect local customs and blend in with the culture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {localEtiquettes.map(({ id, title, description }) => (
            <AccordionItem value={`etiquette-${id}`} key={id}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>{description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
