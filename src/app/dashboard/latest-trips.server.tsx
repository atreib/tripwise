import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkWithSpinner } from "@/components/link-with-spinner";

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
              It seems you haven&apos;t planned any trips yet
            </div>
            <div className="grid col-span-full mx-auto text-center text-sm text-muted-foreground">
              <Button asChild>
                <LinkWithSpinner href="/dashboard/trips?mode=new">
                  Click here to create your first trip
                </LinkWithSpinner>
              </Button>
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
              <Button variant="outline" asChild>
                <LinkWithSpinner href={`/dashboard/trips/${trip.id}`}>
                  See more
                </LinkWithSpinner>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {trips.length > 0 ? (
        <footer className="text-sm text-muted-foreground text-right">
          <Button variant="link" asChild>
            <LinkWithSpinner href="/dashboard/trips">View all</LinkWithSpinner>
          </Button>
        </footer>
      ) : null}
    </>
  );
}
