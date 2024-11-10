import { Skeleton } from "@/components/ui/skeleton";

export function TripsTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
    </div>
  );
}
