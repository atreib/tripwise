import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trip } from "@/lib/trips-service/types";
import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import { CameraIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmokeTestDialog } from "@/components/smoke-test";

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
              <CardFooter className="flex items-end justify-end gap-4">
                <SmokeTestDialog>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Open map</span>
                    <MapPinIcon className="w-6 h-6" />
                  </Button>
                </SmokeTestDialog>
                <SmokeTestDialog>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Open pictures</span>
                    <CameraIcon className="w-6 h-6" />
                  </Button>
                </SmokeTestDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
