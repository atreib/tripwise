import { LatestTrips } from "./latest-trips.server";
import { Suspense } from "react";
import { LatestTripsSkeleton } from "./latest-trips-skeleton.server";

export const experimental_ppr = true;

export default async function DashboardPage() {
  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">Your latest trips...</h1>
      <Suspense fallback={<LatestTripsSkeleton />}>
        <LatestTrips />
      </Suspense>
    </section>
  );
}
