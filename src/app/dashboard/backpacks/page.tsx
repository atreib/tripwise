import { Suspense } from "react";
import { BackpacksTable } from "./backpacks-table.server";
import { BackpacksTableSkeleton } from "./backpacks-table-skeleton.server";
import { NewBackpackDialog } from "./new-backpack-dialog.client";
import { Metadata } from "next";

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "Your backpacks",
};

export default async function BackpacksPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your backpacks</h1>
        <NewBackpackDialog />
      </header>
      <section>
        <Suspense fallback={<BackpacksTableSkeleton />}>
          <BackpacksTable />
        </Suspense>
      </section>
    </div>
  );
}
