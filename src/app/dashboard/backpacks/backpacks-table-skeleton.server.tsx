import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function BackpacksTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-[150px] hidden lg:table-cell">
            Created
          </TableHead>
          <TableHead className="lg:w-[200px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>
            <TableCell className="w-[150px] hidden lg:table-cell">
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell className="lg:w-[200px] flex gap-2 justify-end items-center">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
