import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trip } from "@/lib/trips-service/types";
import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";

type Props = {
  trip: Trip;
};

export async function Attractions({ trip }: Props) {
  await getAuthService().requireAuthSession();

  const pointsOfInterest = await getTripsService().getTripPointsOfInterest({
    tripId: trip.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points of Interest</CardTitle>
        <CardDescription>
          Must-visit attractions in {trip.destination}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {pointsOfInterest.map((poi, index) => (
            <Card key={index} className="w-full lg:max-w-[49%]">
              <CardHeader>
                <CardTitle>{poi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{poi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
