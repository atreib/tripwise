import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon, TrashIcon } from "lucide-react";
import { RemoveTripDialog } from "./remove-trip-dialog.client";
import { LinkWithSpinner } from "@/components/link-with-spinner";

export async function TripsTable() {
  const userId = await getAuthService().requireAuthSession();
  const trips = await getTripsService().getTripsByUserId({ userId });

  return (
    <Table>
      {trips.length > 0 ? <TableCaption>Your trips.</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead>Destination</TableHead>
          <TableHead className="w-[100px] hidden lg:table-cell">
            Season
          </TableHead>
          <TableHead className="w-[100px] hidden lg:table-cell">
            Duration
          </TableHead>
          <TableHead className="lg:w-[200px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-8 text-sm text-muted-foreground"
            >
              No trips found.
            </TableCell>
          </TableRow>
        ) : null}
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell className="font-medium">{trip.destination}</TableCell>
            <TableCell className="w-[100px] hidden lg:table-cell">
              {trip.season}
            </TableCell>
            <TableCell className="w-[100px] hidden lg:table-cell">
              {trip.duration}
            </TableCell>
            <TableCell className="lg:w-[200px] flex gap-2 justify-end items-center">
              <Button size="icon" variant="outline" asChild>
                <LinkWithSpinner
                  href={`/dashboard/trips/${trip.id}`}
                  icon={<EyeIcon className="w-4 h-4" />}
                >
                  <span className="sr-only">Open trip</span>
                </LinkWithSpinner>
              </Button>
              <RemoveTripDialog tripId={trip.id}>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Delete trip</span>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </RemoveTripDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
