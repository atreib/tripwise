import { Suspense } from "react";
import { TripsTable } from "./trips-table.server";
import { TripsTableSkeleton } from "./trips-table-skeleton.server";
import TripPlannerWizard from "./new-trip-wizard.client";
import { Metadata } from "next";

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "Your trips",
};

type Props = {
  searchParams: Promise<{
    mode?: "new";
  }>;
};

export default async function TripsPage({ searchParams }: Props) {
  const { mode } = await searchParams;
  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your trips</h1>
        <TripPlannerWizard defaultOpen={mode === "new"} />
      </header>
      <section>
        <Suspense fallback={<TripsTableSkeleton />}>
          <TripsTable />
        </Suspense>
      </section>
    </div>
  );
}
