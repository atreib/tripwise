import { getAuthService } from "@/lib/auth-service";
import { NewTripBtn } from "./components.client";
import { Suspense } from "react";
import { TripsTable } from "./trips-table.server";
import { TripsTableSkeleton } from "./trips-table-skeleton.server";

export default async function TripsPage() {
  await getAuthService().requireAuthSession();

  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your trips</h1>
        <NewTripBtn />
      </header>
      <section>
        <Suspense fallback={<TripsTableSkeleton />}>
          <TripsTable />
        </Suspense>
      </section>
    </div>
  );
}
