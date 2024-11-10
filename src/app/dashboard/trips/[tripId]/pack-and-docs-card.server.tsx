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

export async function PackAndDocsCard({ trip }: Props) {
  await getAuthService().requireAuthSession();

  const [packingList, requiredDocuments] = await Promise.all([
    getTripsService().getTripPackingList({ tripId: trip.id }),
    getTripsService().getTripRequiredDocuments({ tripId: trip.id }),
  ]);

  return (
    <>
      <Card className="min-w-[50%]">
        <CardHeader>
          <CardTitle>Packing Recommendations</CardTitle>
          <CardDescription>
            Essential items for your trip to {trip.destination}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packingList.map(({ id, item }) => (
              <div className="flex items-center space-x-2" key={id}>
                <input type="checkbox" id={`pack-item-${id}`} />
                <label
                  htmlFor={`pack-item-${id}`}
                  className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
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
    </>
  );
}
