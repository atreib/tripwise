import { Skeleton } from "@/components/ui/skeleton";

export function PackAndDocsCardSkeleton() {
  return (
    <>
      <Skeleton className="h-[600px] w-5/12 rounded-xl" />
      <Skeleton className="h-[600px] w-7/12 rounded-xl" />
    </>
  );
}
