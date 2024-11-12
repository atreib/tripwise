import { Skeleton } from "@/components/ui/skeleton";

export function TripsTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
    </div>
  );
}
