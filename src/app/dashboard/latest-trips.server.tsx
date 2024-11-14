import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ButtonWithLoading } from "@/components/button-with-loading";
import { Loader2Icon, TreePalmIcon } from "lucide-react";

export async function LatestTrips() {
  const userId = await getAuthService().requireAuthSession();
  const trips = await getTripsService().getLatestFewTripByUserId({
    userId,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {trips.length === 0 ? (
          <>
            <div className="grid col-span-full mx-auto text-center text-sm text-muted-foreground">
              It seems you haven&apos;t planned any trips yet...
            </div>
            <div className="grid col-span-full mx-auto text-center text-sm text-muted-foreground">
              <ButtonWithLoading
                asChild
                fallback={
                  <div className="flex items-center">
                    <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                    Click here to create your first trip
                  </div>
                }
              >
                <Link href="/dashboard/trips?mode=new">
                  <TreePalmIcon className="w-4 h-4 mr-1" />
                  Click here to create your first trip
                </Link>
              </ButtonWithLoading>
            </div>
          </>
        ) : null}
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>{trip.destination}</CardTitle>
              <CardDescription className="flex flex-wrap gap-4">
                <p>{trip.season}</p>
                <p>a few {trip.duration}</p>
                <p>{trip.budget}</p>
                <p>{trip.purpose}</p>
              </CardDescription>
            </CardHeader>
            <div className="flex justify-end p-4 pt-0">
              <ButtonWithLoading variant="outline" asChild>
                <Link href={`/dashboard/trips/${trip.id}`}>See more</Link>
              </ButtonWithLoading>
            </div>
          </Card>
        ))}
      </div>
      {trips.length > 0 ? (
        <footer className="text-sm text-muted-foreground text-right">
          <ButtonWithLoading variant="link" asChild>
            <Link href="/dashboard/trips">View all</Link>
          </ButtonWithLoading>
        </footer>
      ) : null}
    </>
  );
}
