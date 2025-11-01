import { getAuthService } from "@/lib/auth-service";
import { getBackpackService } from "@/lib/backpack-service";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon, TrashIcon } from "lucide-react";
import { RemoveBackpackDialog } from "./remove-backpack-dialog.client";
import { LinkWithSpinner } from "@/components/link-with-spinner";

export async function BackpacksTable() {
  const userId = await getAuthService().requireAuthSession();
  const backpacks = await getBackpackService().getBackpacksByUserId({ userId });

  return (
    <Table>
      {backpacks.length > 0 ? <TableCaption>Your backpacks.</TableCaption> : null}
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
        {backpacks.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-center py-8 text-sm text-muted-foreground"
            >
              No backpacks found.
            </TableCell>
          </TableRow>
        ) : null}
        {backpacks.map((backpack) => (
          <TableRow key={backpack.id}>
            <TableCell className="font-medium">{backpack.name}</TableCell>
            <TableCell className="w-[150px] hidden lg:table-cell">
              {new Date(backpack.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="lg:w-[200px] flex gap-2 justify-end items-center">
              <Button size="icon" variant="outline" asChild>
                <LinkWithSpinner
                  href={`/dashboard/backpacks/${backpack.id}`}
                  icon={<EyeIcon className="w-4 h-4" />}
                >
                  <span className="sr-only">Open backpack</span>
                </LinkWithSpinner>
              </Button>
              <RemoveBackpackDialog backpackId={backpack.id}>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Delete backpack</span>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </RemoveBackpackDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
