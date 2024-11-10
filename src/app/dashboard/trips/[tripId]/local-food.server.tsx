import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import { Trip } from "@/lib/trips-service/types";

type Props = {
  trip: Trip;
};

export async function LocalFoodCard({ trip }: Props) {
  await getAuthService().requireAuthSession();
  const localFoods = await getTripsService().getTripLocalFood({
    tripId: trip.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Foods to Try</CardTitle>
        <CardDescription>
          Savor the flavors of {trip.destination}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {localFoods.map((food, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{food.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{food.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
