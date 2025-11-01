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
import { getBackpackService } from "@/lib/backpack-service";
import { CreateTripBackpackDialog } from "./create-trip-backpack-dialog.client";
import { TripBackpackItems } from "./trip-backpack-items.client";
import { Button } from "@/components/ui/button";

type Props = {
  trip: Trip;
};

export async function PackingCard({ trip }: Props) {
  const userId = await getAuthService().requireAuthSession();

  // Check if trip has backpack
  const hasTripBackpack = await getTripsService().hasTripBackpack({
    tripId: trip.id,
  });

  // Fetch user's backpacks for the dialog
  const userBackpacks = await getBackpackService().getBackpacksByUserId({
    userId,
  });

  if (!hasTripBackpack) {
    // Show AI-generated packing list with "Create Trip Backpack" button
    const packingList = await getTripsService().getTripPackingList({
      tripId: trip.id,
    });

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Packing Recommendations</CardTitle>
          <CardDescription>
            AI-generated suggestions for {trip.destination}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Create a trip backpack to customize and track your packing
              </p>
              <CreateTripBackpackDialog
                tripId={trip.id}
                backpacks={userBackpacks}
              />
            </div>

            <div className="space-y-2 opacity-60">
              {packingList.map(({ id, item }) => (
                <div className="flex items-center space-x-2" key={id}>
                  <input
                    type="checkbox"
                    id={`pack-item-${id}`}
                    disabled
                    className="cursor-not-allowed"
                  />
                  <label
                    htmlFor={`pack-item-${id}`}
                    className="leading-none cursor-not-allowed"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show trip backpack with items
  const tripBackpackItems = await getTripsService().getTripBackpackItems({
    tripId: trip.id,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateTripBackpackDialog
          tripId={trip.id}
          backpacks={userBackpacks}
          isReplacing={true}
        >
          <Button variant="outline" size="sm">
            Change template
          </Button>
        </CreateTripBackpackDialog>
      </div>
      <TripBackpackItems tripId={trip.id} initialItems={tripBackpackItems} />
    </div>
  );
}
