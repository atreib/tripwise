import { Suspense } from "react";
import { TripsTable } from "./trips-table.server";
import { TripsTableSkeleton } from "./trips-table-skeleton.server";
import TripPlannerWizard from "./new-trip-wizard.client";

export const experimental_ppr = true;

export default async function TripsPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your trips</h1>
        <TripPlannerWizard />
      </header>
      <section>
        <Suspense fallback={<TripsTableSkeleton />}>
          <TripsTable />
        </Suspense>
      </section>
    </div>
  );
}
