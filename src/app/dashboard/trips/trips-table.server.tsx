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
import Link from "next/link";
import { ButtonWithLoading } from "@/components/button-with-loading";
import { EyeIcon, Loader2Icon, TrashIcon } from "lucide-react";
import { RemoveTripDialog } from "./remove-trip-dialog.client";

export async function TripsTable() {
  const userId = await getAuthService().requireAuthSession();
  const trips = await getTripsService().getTripsByUserId({ userId });

  return (
    <Table>
      <TableCaption>Your trips.</TableCaption>
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
              <ButtonWithLoading
                size="icon"
                variant="outline"
                fallback={
                  <div>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  </div>
                }
                asChild
              >
                <Link href={`/dashboard/trips/${trip.id}`}>
                  <EyeIcon className="w-4 h-4" />
                </Link>
              </ButtonWithLoading>
              <RemoveTripDialog tripId={trip.id}>
                <Button variant="outline" size="icon">
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
