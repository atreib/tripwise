"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trip } from "@/lib/trips-service/types";
import { Loader2Icon } from "lucide-react";
import { deleteTripAction } from "./actions";

type Props = {
  tripId: Trip["id"];
};

export function RemoveTripDialog({
  children,
  tripId,
}: React.PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();

  async function handleRemoveTrip() {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const res = await deleteTripAction({ id: tripId });
      if (res?.serverError) throw new Error(res.serverError);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("idle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your trip
            and remove your data from our servers.
          </DialogDescription>

          {error ? (
            <aside className="mt-4">
              <p className="text-red-500">{error}</p>
            </aside>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={status === "loading"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleRemoveTrip}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
