import { Skeleton } from "@/components/ui/skeleton";

export function LatestTripsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      <Skeleton className="w-full h-[130px]" />
      <Skeleton className="w-full h-[130px]" />
      <Skeleton className="w-full h-[130px]" />
    </div>
  );
}
