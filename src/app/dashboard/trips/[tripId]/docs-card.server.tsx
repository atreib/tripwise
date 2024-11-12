import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthService } from "@/lib/auth-service";
import { Trip } from "@/lib/trips-service/types";
import { getTripsService } from "@/lib/trips-service";

type Props = {
  trip: Trip;
};

export async function DocsCard({ trip }: Props) {
  await getAuthService().requireAuthSession();

  const requiredDocuments = await getTripsService().getTripRequiredDocuments({
    tripId: trip.id,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>
          Ensure you have these documents for a smooth journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {requiredDocuments.map(({ id, document }) => (
            <li key={id}>{document}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
